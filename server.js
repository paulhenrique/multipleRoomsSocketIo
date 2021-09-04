const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const server = require("http").createServer(app);

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

let messages = [];
io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    if (!Boolean(messages[room])) {
      messages[room] = [];
    }
    io.sockets.in(room).emit('previousMessages', messages[room]);
  });

  socket.on("sendMessage", (data) => {
    if(!data) return;
    if (!Boolean(messages[data.room])) {
      messages[data.room] = [];
    }

    messages[data.room].push(data);
    socket.to(data.room).emit("recivedMessage", data);
  });

});

server.listen(3000);
