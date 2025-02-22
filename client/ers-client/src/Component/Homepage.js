import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Make sure to install socket.io-client

const Homepage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameCode, setGameCode] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create a socket connection when the component mounts
        const newSocket = io('http://localhost:3000'); // Replace with your server URL
        setSocket(newSocket);
        
        // Cleanup on component unmount
        return () => newSocket.close();
    }, []);

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
        setIsModalOpen(false);
        // Add logic to join the game with the game code here
    };

    const handleCreateGameClick = () => {
        if (socket) {
            const createdGameCode = socket.id;  // Using socket.id as the game code
            setGameCode(createdGameCode);
            console.log("Game created with code:", createdGameCode);
            // Redirect to the lobby with the game code
            // You can use `window.location` to redirect or use React Router if in a single-page app
            window.location.href = `/lobby/${createdGameCode}`;
        }
    };

    return (
        <div>
            <div>
                <button onClick={handleCreateGameClick}>Create Game</button>
                <button onClick={handleJoinGameClick}>Join Game</button>
            </div>

            {/* Modal Popup */}
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
