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

        if(socket) {
            socket.emit('joinGame', {
                gameId: gameCode,
                playerId: socket.id
            })
        }

        setIsModalOpen(false);
        localStorage.setItem("gameId", gameCode);

        navigate(`/lobby/${gameCode}`);
    };

    const handleCreateGameClick = () => {
        if (socket) {
            const createdGameCode = socket.id;  
            localStorage.setItem("gameId", createdGameCode);

            setGameCode(createdGameCode);

            if (socket) {
                socket.emit("createGame", [socket.id]);  
            }

            navigate(`/lobby/${createdGameCode}`);
        }
    };

    return (
        <div id='homepage'>
            <div id='button-div'>
                <button className="homepage-buttons" onClick={handleCreateGameClick}>Create Game</button>
                <button className="homepage-buttons">Rules</button>
                <button className="homepage-buttons" onClick={handleJoinGameClick}>Join Game</button>
            </div>
    
            {/* Modal pop-up */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {/* Cancel Button at top-right */}
                        <button className="cancel-button" onClick={handleCloseModal}>Cancel</button>
    
                        <h2>Enter Game Code</h2>
                        <input
                            type="text"
                            value={gameCode}
                            onChange={handleInputChange}
                            placeholder="Enter game code"
                        />
    
                        {/* Join Button at the bottom */}
                        <button className="join-button" onClick={handleSubmitGameCode}>Join</button>
                    </div>
                </div>
            )}
        </div>
    );
    
    
};

export default Homepage;
