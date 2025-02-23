import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Gameplay from './Gameplay';

const Lobby = ({ socket }) => {  
    const { gameCode } = useParams();
    const [startButton, setStartButton] = useState(false);
    const [gameplay, setGameplay] = useState(false);

    useEffect(() => {
        if (socket) {
            console.log(`Connected to game: ${gameCode} with socket ID: ${socket.id}`);
        }
        if(gameCode == socket.id) setStartButton(true);
    }, [socket, gameCode]);

    const handleStartGame = () => {
        if(socket) {
            socket.emit("startGame", gameCode)
        }
        setStartButton(false);
    }

    socket.on("gameStarted", ({playersLength}) => {
        setGameplay(true);
    })


    return (
        <div>
            <h1>Lobby</h1>
            <p>Game Code: {gameCode}</p>
            {
                startButton && 
                <button onClick={handleStartGame}>start game</button>
            }

            {
                gameplay &&
                <Gameplay/>
            }
        </div>
    );
};

export default Lobby;
