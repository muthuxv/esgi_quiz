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
    origin: "http://195.35.29.110:3000",
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
app.use("/", SecurityRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

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