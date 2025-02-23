import PhaserGame from './Phaser';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const Gameplay = ({socket}) => {
    const location = useLocation();
    const { gameInfo } = location.state || {}; // Access the game data passed from the Lobby
    console.log(gameInfo)
    

    return (
        <div id='gameplay-container'>
            <PhaserGame players={gameInfo.players} socket={socket}/>
        </div>
    )
}


export default Gameplay;

