const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    }
  });

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