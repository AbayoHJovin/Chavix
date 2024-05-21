const port = 1024;
const io = require("socket.io")(port, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  socket.on("msg", (message) => {
    console.log(message);
    console.log(`Message received: ${message.text}`);
    // if (message.room !== "") {
      // io.to(message.room).emit("dm", message);
    // } else {
      socket.broadcast.emit("receive", message);
    // }
  });

  socket.on("join", (room) => {
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
