const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const db = require("./models");
const UserRoutes = require("./routes/user");
const QuizRoutes = require("./routes/quiz");
const QuestionRoutes = require("./routes/question");
const OptionRoutes = require("./routes/option");
const SecurityRoutes = require("./routes/security");

db.sequelize.sync({alter: true}).then(() => {
    console.log("Drop and re-sync db.");
  }).catch((error) => {
    console.log(error);
  });

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    }
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRoutes);
app.use("/quizzes", QuizRoutes);
app.use("/questions", QuestionRoutes);
app.use("/options", OptionRoutes);
app.use("/", SecurityRoutes);

io.on("connection", (socket) => {
    console.log("a user connected");
    
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        io.emit("chat message", msg);
    });
    
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

httpServer.listen(3001, () => {
    console.log("listening on *:3001");
}
);