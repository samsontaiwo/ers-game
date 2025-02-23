import PhaserGame from './Phaser';


const Gameplay = ({gameData}) => {
    console.log(gameData);
    return (
        <div id='gameplay-container'>
            <PhaserGame players={gameData.players}/>
        </div>
    )
}


export default Gameplay;

