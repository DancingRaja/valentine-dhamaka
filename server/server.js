const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.static(path.join(__dirname, "../public")));

// Store last known location
let lastLocation = null;

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // Send last known location immediately to new connection
  if(lastLocation) {
    socket.emit("admin-live-location", lastLocation);
  }

  socket.on("live-location", (data) => {
    lastLocation = data; // Update cache
    io.emit("admin-live-location", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
