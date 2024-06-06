const port = 1024;
const io = require("socket.io")(port, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  socket.on("msg", (message) => {
    io.to(message.room).emit("dm", message);

    // socket.broadcast.emit("dm",message)
    console.log(`Message received: ${message.text} in room ${message.room}`);
  });

  socket.on("join", (room, name) => {
    console.log(`${name} joined room: ${room}`);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
