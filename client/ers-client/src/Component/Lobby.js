import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Chat from "./Chat";
//wws in the chat you feel me

const Lobby = ({ socket }) => {
  const { gameCode } = useParams();
  const [startButton, setStartButton] = useState(false);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');
  const [lives, setLives] = useState(2);  // Default to 2 lives
  const [timer, setTimer] = useState(2);  // Default to 2s
  const [autoShuffle, setAutoShuffle] = useState(false);
  const [ready, setReady] = useState(false);
  const [readyStatus, setReadyStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      if (gameCode === socket.id) setStartButton(true);

      socket.on("gameStarted", ({ gameInfo, playerCardCounts }) => {
        navigate(`/gameplay/${gameCode}/live-gameplay`, { state: { gameInfo, playerCardCounts } });
      });

      socket.on("playerInfo", (data) => {
        if (data && data.length > 0) {
          setPlayerInfo(data);
        } else {
          // If we get empty data, retry once after a short delay
          setTimeout(() => {
            socket.emit("joinGame", {
              gameId: gameCode,
              playerId: socket.id,
              displayName: localStorage.getItem("displayName") // Make sure to store this when user enters name
            });
          }, 200);
        }
      });

      socket.on("update-ready-box", ({ind, text, color}) => {
        const span = document.querySelectorAll(".player-div section")[ind].querySelector(".ready")
        span.textContent = text;
        span.style.color = color
      });

      socket.on("settings-updated", ({ lives: newLives, timer: newTimer, autoShuffle: newAutoShuffle }) => {
        setLives(newLives);
        setTimer(newTimer);
        setAutoShuffle(newAutoShuffle);
      });

      return () => {
        socket.off("gameStarted");
        socket.off("playerInfo");
        socket.off("settings-updated");
      };
    }
  }, [socket, gameCode, navigate]);

  useEffect(() => {
    if(ready){
    }
  }, ready)

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", gameCode);
      socket.emit("update-settings", { gameCode, lives, autoShuffle });
    }
    // console.log('starting game');
    // setStartButton(false);
  };

  const handleCopy = () => {
    const textField = document.getElementById("gameCodeText");
    textField.select();

    // Copy the text to clipboard
    document.execCommand("copy");

    // Show a message for a few seconds
    setCopyMessage('Copied to clipboard!');
    setTimeout(() => setCopyMessage(''), 2000);
  };

  const handleLivesChange = (change) => {
    if (socket.id === gameCode) {
      const newLives = Math.max(1, Math.min(4, lives + change));
      setLives(newLives);
      socket.emit("update-settings", { gameCode, lives: newLives, autoShuffle });
    }
  };

  const handleTimerChange = (newTimer) => {
    if (socket.id === gameCode) {
      setTimer(newTimer);
      socket.emit("update-settings", { gameCode, lives, timer: newTimer, autoShuffle });
    }
  };

  const handleAutoShuffleChange = () => {
    if (socket.id === gameCode) {
      const newAutoShuffle = !autoShuffle;
      setAutoShuffle(newAutoShuffle);
      socket.emit("update-settings", { gameCode, lives, timer, autoShuffle: newAutoShuffle });
    }
  };

  const handleReadyUp = () => {
    setReady(!ready);
    let readyStatus = !ready;
    if(socket){
      let obj = {
        gameId: gameCode, 
        playerId: socket.id,
        readyStatus,
      }
      socket.emit('ready-or-not', obj);
    }
  }

  return (
    <div id="lobby">
      <div className="player-div">
        <div className="lobby-title"> Players {`(${playerInfo.length}/`}{playerInfo.length > 0 ? playerInfo[0].numPlayers : ''}) </div>
        {playerInfo.map((player, i) => (
          <section key={i}>
            <img className="avatar" src="/assets/images/playerAvatar.png" alt="Player Avatar" />
            <div className="displayName">{player.displayName}</div>
            <span className="ready">NOT READY</span>
          </section>
        ))}
      </div>

      <div className="setting-div">
        <div className="lobby-title">Game Settings</div>
        <section>
          <div>Invite Friends. Room ID:</div>
          <div id="copyGameCode">
            <input id="gameCodeText" type="text" value={gameCode} readOnly />
            <button onClick={handleCopy}>Copy</button>
          </div>
          {copyMessage && <span id="copyMessage">{copyMessage}</span>}
          <div id="four-sett">
            {/* Lives Setting */}
            <div id="lives">
              <div>
                <div>Lives </div>
                <div className="info-icon" title="Choose the number of lives (default is 2).">ℹ️</div>
              </div>
              <div>
                <button 
                  className="adjust-heart-buttons" 
                  onClick={() => handleLivesChange(-1)}
                  disabled={socket.id !== gameCode}
                >&lt;</button>
                <div className="heart-container">
                  {[...Array(lives)].map((_, i) => (
                    <img key={i} className="heart" src="/assets/images/heart.png" alt="Heart" />
                  ))}
                </div>
                <button 
                  className="adjust-heart-buttons" 
                  onClick={() => handleLivesChange(1)}
                  disabled={socket.id !== gameCode}
                >&gt;</button>
              </div>
              
            </div>

            {/* Timer Setting */}
            {/* <div id="timer">
              <div>
                <span>Timer: </span>
                <span className="info-icon" title="Choose the countdown timer (default is 2 seconds).">ℹ️</span>
              </div>
              <div className="timer-options">
                {[2, 3, 4].map((option) => (
                  <button
                    key={option}
                    className={`timer-button ${timer === option ? "selected" : ""}`}
                    onClick={() => handleTimerChange(option)}
                    disabled={socket.id !== gameCode}
                  >
                    {option}s
                  </button>
                ))}
              </div>
            </div> */}

            {/* AutoShuffle Toggle */}
            <div id="autoshuffle">
              <div>
                <span>Auto Shuffle: </span>
                <span className="info-icon" title="Enable or disable automatic shuffling of cards.">ℹ️</span>
              </div>
              <div 
                className={`toggle-slider ${autoShuffle ? "on" : "off"}`} 
                onClick={handleAutoShuffleChange}
                style={{ cursor: socket.id === gameCode ? 'pointer' : 'not-allowed' }}
              >
                <div className="toggle-thumb"></div>
              </div>
            </div>

            <div id="start-game-button">
              {socket.id === gameCode && 
                <button onClick={handleStartGame}>
                  Start Game
                </button>
              
              }
            </div>


          </div>
        </section>
        
        <section id="ready-or-not">
          <label className="ready-label">
            I'm Ready
            <input type="checkbox" className="ready-checkbox" onClick={handleReadyUp}/>
            <span className="checkmark"></span>
          </label>
          <div>
          </div>
        </section>
      </div>

      <div className="chat-div">
        <div className="chat-title">Room Chat</div>
        {/* <section>
          <Chat socket={socket}/>
        </section> */}
        <Chat socket={socket}/>
      </div>
    </div>
  );
};

export default Lobby;
