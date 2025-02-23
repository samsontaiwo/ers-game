import PhaserGame from './Phaser';


const Gameplay = ({gameData, socket}) => {
    // console.log(gameData);
    return (
        <div id='gameplay-container'>
            <PhaserGame players={gameData.players} socket={socket}/>
        </div>
    )
}


export default Gameplay;

