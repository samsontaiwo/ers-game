const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const ERSGame = require("./game");
const getCardImg = require("./api");
// const { isBooleanObject } = require("util/types");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let games = {};

io.on("connection", (socket) => {
    console.log("A player connected: " + socket.id);
    
    socket.on("createGame", ({playerId, displayName, numPlayers, handColor}) => {
        games[socket.id] = new ERSGame([{playerId, displayName, numPlayers, handColor}]);
        socket.join(socket.id); // joins the lobby
        let game = games[socket.id];

        // Emit playerInfo immediately for the creator
        setTimeout(() => {
            io.to(socket.id).emit('playerInfo', game.players);
        }, 1500);
    });

    socket.on("joinGame", ({gameId, playerId, displayName}) => {
        let game = games[gameId];
        if (!game) {
            console.log('not working');
            socket.emit("error", { message: "Game not found!" });
            return;
        }
        let numPlayers = game.players[0].numPlayers;
      
        game.addPlayer({gameId, playerId, displayName, numPlayers});  
        console.log(games);
        socket.join(gameId);

        // Emit to all players in the lobby, including the new joiner
        io.to(gameId).emit('playerInfo', game.players);
    });

    socket.on("ready-or-not", ({gameId, playerId, readyStatus}) => { 
        let game = games[gameId];
        let socketIds = game.players;
        let ind;
        let text;
        let color;
        socketIds.forEach((ele, i) => {
            if(ele.playerId == playerId){
                ind = i;
            }
        })
        if(readyStatus){
            text = 'READY';
            color = '#1FAB1C'
        }else{
            text = 'NOT READY';
            color = '#ff0000'
        }
        io.to(gameId).emit('update-ready-box', {ind, text, color})
    })

    socket.on("sendMessage", ({playerId, gameId, message}) => {
        let game = games[gameId];
        let name; 
        game.players.forEach((ele, i) => {
            if(ele.playerId == playerId){
                name = ele.displayName
            }
        })
        io.to(gameId).emit('receiveMessage', {name, message})
    })

    socket.on("startGame", (gameId) => {
        let game = games[gameId];
        if(!game) return;

        let hands = game.assignCards();

        const playerCardCounts = Object.entries(hands).map(([playerId, cards]) => ({
            playerId,
            cardCount: cards.length,
          }));

        // console.log(playerCardCounts);


        io.to(gameId).emit('gameStarted', {gameInfo: game, playerCardCounts})
    })

    socket.on("playCard", ({gameId, playerId}) => {
        let game = games[gameId];
        if (!game) return;
    
        let result = game.playCard(playerId);
        
        if (!result.success && result.message === "Game is locked") {
            return;
        }

        console.log(result);
        let cardImg = getCardImg(result);

        io.to(gameId).emit("cardPlayed", { gameId, playerId, result, cardImg });

        // Handle challenge completion
        if (result.challengeComplete) {
            setTimeout(() => {
                if (game.isWaitingForSlap) {
                    // If no one slapped, give cards to winner
                    game.hands[result.challengeWinner] = [...game.hands[result.challengeWinner], ...game.pile];
                    io.to(gameId).emit('challengeWon', { 
                        playerId: result.challengeWinner,
                        cardCount: game.hands[result.challengeWinner].length 
                    });
                    game.pile = [];
                    game.faceCardChallenge = null;
                    game.forcedTurn = 0;
                    game.currentTurn = game.players.findIndex(player => player.playerId === result.challengeWinner);
                    game.isWaitingForSlap = false;
                }
            }, 1500);
        }
    
        let winCheck = game.checkWin();
        if (winCheck) {
            io.to(gameId).emit("gameWon", winCheck);
            delete games[gameId];
            console.log(`Game ${gameId} ended and removed from memory`);
        }
    });

    socket.on("slap", ({gameId, playerId}) => {
        let game = games[gameId];
        if (!game) return;
    
        let result = game.slap(playerId);
        io.to(gameId).emit("slapResult", { gameId, playerId, result });
    });

    socket.on("update-settings", ({gameCode, lives, timer, autoShuffle}) => {
        let game = games[gameCode];
        if (!game) return;
        
        let settings = game.settings({lives, autoShuffle});
        console.log(settings);

        io.to(gameCode).emit('settings-updated', settings);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected: " + socket.id);
    });




});



app.get("/", (req, res) => res.send("ERS Game Server Running"));

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
  