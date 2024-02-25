const express = require("express");
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const db = require("./models");
const UserRoutes = require("./routes/user");
const QuizRoutes = require("./routes/quiz");
const QuestionRoutes = require("./routes/question");
const OptionRoutes = require("./routes/option");
const RoomRoutes = require("./routes/room");
const SecurityRoutes = require("./routes/security");
const ResponseRoutes = require("./routes/response");
const { Console } = require("console");

let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

const questionTimers = new Map();
const questionTimeByRoom = new Map();

function startQuestionTimer(roomId, quizId, questionId, count) {
  let timeLeft = 30;
  if(questionTimeByRoom.get(quizId) > 0){
    timeLeft = questionTimeByRoom.get(quizId);
  }

  if (questionTimers.has(roomId)) {
    clearInterval(questionTimers.get(roomId));
  }

  const interval = setInterval(() => {
    timeLeft--;
    io.to(roomId).emit('timer', timeLeft);

    if (timeLeft <= 0) {
      clearInterval(interval);
      console.log("Times up");
      io.to(roomId).emit('answerQuestion', roomId, quizId, questionId, null, false, count + 1);
    }
  }, 1000);

  questionTimers.set(roomId, interval);
}

db.sequelize.sync({alter: true}).then(() => {
    console.log("Drop and re-sync db.");
  }).catch((error) => {
    console.log(error);
  });

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"] 
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);
app.use("/quizzes", QuizRoutes);
app.use("/questions", QuestionRoutes);
app.use("/options", OptionRoutes);
app.use("/rooms", RoomRoutes);
app.use("/responses", ResponseRoutes);
app.use("/", SecurityRoutes);

const optionCounters = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('changeQuestionTime', (roomId, newTime) => {
    console.log(`Changing question time for room ${roomId} to ${newTime}`);
    questionTimeByRoom.set(roomId, parseInt(newTime));
    console.log(questionTimeByRoom);
  });

  socket.on('sendChatMessage', (roomId, user, message) => {
    io.to(roomId).emit('chatMessage', { user, message });
  });

  socket.on('joinQuiz', (quizId, user) => {
    socket.join(quizId);
    console.log(user.login + " has joined the quiz");
    io.to(quizId).emit('userJoined', user);
  });

  socket.on('startQuiz', (roomId, quizId) => {
    console.log('Quiz has started:', roomId, quizId);
    socket.join(quizId);
    io.to(quizId).emit('quizStarted', roomId, quizId);
  });

  socket.on('nextQuestion', (roomId, quizId, count) => {
    console.log('Next question:', roomId, quizId);
    socket.join(roomId);

    fetch(`http://localhost:3001/quizzes/${quizId}`).then(response => {
      return response.json();
    }).then(data => {
      const questions = data.questions;

      if (count >= questions.length) {
        console.log('Quiz has ended:', roomId, quizId);
        io.to(roomId).emit('quizEnded', roomId, quizId);
        return;
      }

      const questionId = questions[count].id;

      optionCounters.set(questionId, {});

      startQuestionTimer(roomId, quizId, questionId, count);
      console.log('Emitting next question:', questions[count]);

      io.to(roomId).emit('nextQuestion', quizId, questions[count], count);
      io.to(roomId).emit('resetOptionCounters');
    });
  });

  socket.on('answerQuestion', (roomId, quizId, questionId, user, answer, count) => {
    console.log('Answer question:', roomId, quizId, questionId, user, answer);
    
     if (!optionCounters.has(questionId)) {
        optionCounters.set(questionId, {});
    }
    const counters = optionCounters.get(questionId);
    counters[answer] = (counters[answer] || 0) + 1;
    optionCounters.set(questionId, counters);
    
    io.to(roomId).emit('updateOptionCounter', questionId, counters);

    socket.join(roomId);
    socket.emit('questionAnswered', roomId, quizId, questionId, user, answer, count + 1);
  });
  
  socket.on('leaveQuiz', (quizId, user) => {
    socket.leave(quizId);
    console.log(user.login + " has logged out");
    io.to(quizId).emit('userLeft', user);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


server.listen(3001, () => {
    console.log("listening on *:3001");
});