const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("A player connected: " + socket.id);
    socket.on("disconnect", () => console.log("A player disconnected"));
});

app.get("/", (req, res) => res.send("ERS Game Server Running"));

server.listen(3000, () => console.log("Server running on port 3000"));