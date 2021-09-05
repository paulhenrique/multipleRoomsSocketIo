const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const { createMessage, getMessages } = require("./messageHandlers/index.js");

app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:8000"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", async (room) => {
    socket.join(room);
    const previousMessages = await getMessages('room', room);
    io.sockets.in(room).emit('previousMessages', previousMessages);
  });

  socket.on("sendMessage", (data) => {
    createMessage(data);
    socket.to(data.room).emit("recivedMessage", data);
  });

});

server.listen(3000);
