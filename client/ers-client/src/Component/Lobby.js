import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Lobby = ({ socket }) => {  
    const { gameCode } = useParams();

    useEffect(() => {
        if (socket) {
            console.log(`Connected to game: ${gameCode} with socket ID: ${socket.id}`);
        }
    }, [socket, gameCode]);

    return (
        <div>
            <h1>Lobby</h1>
            <p>Game Code: {gameCode}</p>
        </div>
    );
};

export default Lobby;
