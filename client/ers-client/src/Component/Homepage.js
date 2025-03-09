import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FourSquare } from 'react-loading-indicators';

const Homepage = ({ socket }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [joinStep, setJoinStep] = useState(1); // New state for Join modal steps
    const [gameCode, setGameCode] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [numPlayers, setNumPlayers] = useState(2);
    const [handColor, setHandColor] = useState('red');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handlers for Join Game
    const handleJoinGameClick = () => {
        setIsJoinModalOpen(true);
        setJoinStep(1); // Reset step to 1 when opening modal
    };
    
    const handleCloseJoinModal = () => {
        setIsJoinModalOpen(false);
        setJoinStep(1);
    };

    const handleDisplayNameSubmit = () => {
        if (displayName.trim()) {
            setJoinStep(2); // Move to next step (enter game code)
        }
    };

    const handleInputChange = (e) => setGameCode(e.target.value);

    const handleSubmitGameCode = () => {
        if (socket) {
            socket.emit('joinGame', { gameId: gameCode, playerId: socket.id, displayName });
        }
        setIsJoinModalOpen(false);
        localStorage.setItem("gameId", gameCode);
        navigate(`/lobby/${gameCode}`);
    };

    // Handlers for Create Game
    const handleCreateGameClick = () => {
        setIsCreateModalOpen(true);
        setStep(1);
    };
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setStep(1);
    };

    const handleNextStep = () => setStep(step + 1);
    const handlePreviousStep = () => setStep(step - 1);

    const handleConfirmCreateGame = () => {
        if (socket) {
            const createdGameCode = socket.id;
            localStorage.setItem("gameId", createdGameCode);
            socket.emit("createGame", { playerId: createdGameCode, displayName, numPlayers, handColor });
            
            setLoading(true);
            setIsCreateModalOpen(false);

            setTimeout(() => {
                navigate(`/lobby/${createdGameCode}`);
            }, 3000);
        }
    };

    const handleRules = () => navigate('/rules');

    return (
        <div id='homepage'>
            {/* Main Buttons */}
            <div id='button-div'>
                <button className="homepage-buttons" onClick={handleCreateGameClick}>Create Game</button>
                <button className="homepage-buttons" onClick={handleRules}>Rules</button>
                <button className="homepage-buttons" onClick={handleJoinGameClick}>Join Game</button>
            </div>

            {/* Join Game Modal */}
            {isJoinModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <FontAwesomeIcon className="cancel-button" onClick={handleCloseJoinModal} icon={faX} />

                        {/* Step 1: Enter Display Name */}
                        {joinStep === 1 && (
                            <>
                                <h2 className='modal-create-questions'>Enter Display Name</h2>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name"
                                />
                                <button className="next-button join-button" onClick={handleDisplayNameSubmit} disabled={!displayName}>
                                    Next
                                </button>
                            </>
                        )}

                        {/* Step 2: Enter Game Code */}
                        {joinStep === 2 && (
                            <>
                                <h2 className='enter-game-code'>Enter Game Code</h2>
                                <input type="text" value={gameCode} onChange={handleInputChange} placeholder="Enter game code" />
                                <button className="join-button" onClick={handleSubmitGameCode}>Join</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Create Game Modal (Step-by-Step) */}
            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <FontAwesomeIcon className="cancel-button" onClick={handleCloseCreateModal} icon={faX} />

                        {step === 1 && (
                            <>
                                <h2 className='modal-create-questions'>Enter Display Name</h2>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name"
                                />
                                <button className="next-button join-button" onClick={handleNextStep} disabled={!displayName}>Next</button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2 className='modal-create-questions'>Select Number of Players</h2>
                                <div className="player-options">
                                    {[2, 3, 4].map(num => (
                                        <div
                                            key={num}
                                            className={`player-icon ${numPlayers === num ? 'selected' : ''}`}
                                            onClick={() => setNumPlayers(num)}
                                        >
                                            <img src={`/assets/images/${num}player.png`} className="player-image" />
                                        </div>
                                    ))}
                                </div>
                                <button className="prev-button" onClick={handlePreviousStep}>Back</button>
                                <button className="next-button" onClick={handleNextStep}>Next</button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h2 className='modal-create-questions'>Select Hand Color</h2>
                                <div className="color-options">
                                    {['red', 'blue', 'green', 'yellow'].map(color => (
                                        <button
                                            key={color}
                                            className={`color-button ${handColor === color ? 'selected' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setHandColor(color)}
                                        />
                                    ))}
                                </div>
                                <button className="prev-button" onClick={handlePreviousStep}>Back</button>
                                <button className="next-button" onClick={handleConfirmCreateGame}>Create Game</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Loading Animation */}
            {loading && (
                <div className="loading-overlay">
                    <FourSquare color="#BB8B5B" size="large" text="" textColor="" />
                    <p>Creating game...</p>
                </div>
            )}
        </div>
    );
};

export default Homepage;
