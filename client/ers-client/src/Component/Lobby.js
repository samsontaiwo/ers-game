import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Gameplay from "./Gameplay";

const Lobby = ({ socket }) => {
  const { gameCode } = useParams();
  const [startButton, setStartButton] = useState(false);
  const [gameplay, setGameplay] = useState(false);
  const [gameData, setGameData] = useState();

  useEffect(() => {
    if (socket) {
      console.log(`Connected to game: ${gameCode} with socket ID: ${socket.id}`);
      if (gameCode === socket.id) setStartButton(true);

      // ✅ Attach event listener only once
      socket.on("gameStarted", ({ gameInfo }) => {
        setGameData(gameInfo);
        setGameplay(true);
        console.log(gameInfo, "from lobby");
      });

      // ✅ Cleanup function to remove listener when the component unmounts
      return () => {
        socket.off("gameStarted");
      };
    }
  }, [socket]); // Only re-run if `socket` changes

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", gameCode);
    }
    setStartButton(false);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <p>Game Code: {gameCode}</p>
      {startButton && <button onClick={handleStartGame}>Start Game</button>}
      {gameplay && <Gameplay gameData={gameData} />}
    </div>
  );
};

export default Lobby;
