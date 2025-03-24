import PhaserGame from './Phaser';
import { useLocation } from 'react-router-dom';


const Gameplay = ({socket}) => {
    const location = useLocation();
    const { gameInfo, playerCardCounts, initalLives } = location.state || {}; // Access the game data passed from the Lobby
    // console.log(gameInfo)
    

    return (
        <div id='gameplay-container'>
            <PhaserGame gameInfo={gameInfo} playerCardCounts={playerCardCounts} socket={socket}/>
        </div>
    )
}


export default Gameplay;

