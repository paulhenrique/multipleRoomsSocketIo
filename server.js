const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const server = require("http").createServer(app);

app.use(cors({ origin: "*" }));
const defineHeaders = function (res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setTimeout(120 * 60 * 1000, function () {
    res.status(408).json("Request has timed out.");
  });
};
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  defineHeaders();
  res.render("index.html");
});

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:8000"],
  },
});

let messages = [];
io.on("connection", (socket) => {
  console.log("Socket conectado" + socket.id);
  socket.on("join", (room) => {
    socket.join(room);
    socket.to(room).emit("previousMessages", messages);
  });

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (data) => {
    if (!Boolean(messages[data.room])) {
      messages[data.room] = [];
    }

    messages[data.room].push(data);
    console.log(messages);
    socket.to(data.room).emit("recivedMessage", data);
  });
});

server.listen(3000);
