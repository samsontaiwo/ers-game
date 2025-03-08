import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const Lobby = ({ socket }) => {
  const { gameCode } = useParams();
  const [startButton, setStartButton] = useState(false);
  const navigate = useNavigate(); // Hook for navigating programmatically

  useEffect(() => {
    if (socket) {
      // console.log(`Connected to game: ${gameCode} with socket ID: ${socket.id}`);
      if (gameCode === socket.id) setStartButton(true);

      socket.on("gameStarted", ({ gameInfo }) => {
        navigate(`/gameplay/${gameCode}/live-gameplay`, { state: { gameInfo } }); // Navigate to the Gameplay screen, passing the game data
      });

      return () => {
        socket.off("gameStarted");
      };
    }
  }, [socket, gameCode, navigate]); // Dependencies: socket, gameCode, navigate

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", gameCode);
    }
    setStartButton(false);
  };

  return (
    <div id="lobby">
      <h1>Lobby</h1>
      <p>Game Code: {gameCode}</p>
      <p>Socket ID: {socket.id}</p>
      {startButton && <button onClick={handleStartGame}>Start Game</button>}
    </div>
  );
};

export default Lobby;