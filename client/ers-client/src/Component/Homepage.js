import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = ({ socket }) => {  // Receive socket as a prop
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameCode, setGameCode] = useState('');
    const navigate = useNavigate(); 

    const handleJoinGameClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        setGameCode(e.target.value);
    };

    const handleSubmitGameCode = () => {
        console.log("Game code entered:", gameCode);

        if(socket) {
            socket.emit('joinGame', {
                gameId: gameCode,
                playerId: socket.id
            })
        }

        setIsModalOpen(false);
        navigate(`/lobby/${gameCode}`);
    };

    const handleCreateGameClick = () => {
        if (socket) {
            const createdGameCode = socket.id;  
            setGameCode(createdGameCode);
            console.log("Game created with code:", createdGameCode);

            if (socket) {
                socket.emit("createGame", [socket.id]);  
            }

            navigate(`/lobby/${createdGameCode}`);
        }
    };

    return (
        <div>
            <div>
                <button onClick={handleCreateGameClick}>Create Game</button>
                <button onClick={handleJoinGameClick}>Join Game</button>
            </div>

            {isModalOpen && (
                <div>
                    <div>
                        <h2>Enter Game Code</h2>
                        <input
                            type="text"
                            value={gameCode}
                            onChange={handleInputChange}
                            placeholder="Enter game code"
                        />
                        <button onClick={handleSubmitGameCode}>Join</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
