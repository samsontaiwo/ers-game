const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const ERSGame = require("./game");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let games = {};

io.on("connection", (socket) => {
    console.log("A player connected: " + socket.id);
    
    socket.on("createGame", (players) => {
        games[socket.id] = new ERSGame(players);
        socket.join(socket.id); //joins the lobby
        let game = games[socket.id];
        
        
    });

    socket.on("joinGame", ({gameId, playerId}) => {
        let game = games[gameId];
        if (!game) {
            console.log('not working');
          // If the game doesn't exist, send an error message
          socket.emit("error", { message: "Game not found!" });
          return;
        }
      
        
        game.addPlayer(socket.id);  
        console.log(games);
        socket.join(gameId);
    });

    socket.on("startGame", (gameId) => {
        let game = games[gameId];
        if(!game) return;

        game.assignCards();

        console.log(game);

        io.to(gameId).emit('gameStarted', {gameInfo: game})
    })

    socket.on("playCard", ({gameId, playerId}) => {
        let game = games[gameId];
        if (!game) return;
    
        let result = game.playCard(playerId);
        console.log(result);
        io.emit("cardPlayed", { gameId, playerId, result });
    
        let winCheck = game.checkWin();
        if (winCheck) io.emit("gameWon", winCheck);
    });

    socket.on("slap", (gameId, playerId) => {
        let game = games[gameId];
        if (!game) return;
    
        let result = game.slap(playerId);
        io.emit("slapResult", { gameId, playerId, result });
    });
    
    socket.on("disconnect", () => {
        console.log("Player disconnected: " + socket.id);
    });




});












app.get("/", (req, res) => res.send("ERS Game Server Running"));

server.listen(3000, () => console.log("Server running on port 3000"));