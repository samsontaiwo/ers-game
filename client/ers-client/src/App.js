import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io client
import Homepage from './Component/Homepage';
import Lobby from './Component/Lobby';
import './App.css';

const App = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize the socket only once
        const newSocket = io('http://localhost:3000'); // Replace with your server URL
        setSocket(newSocket);

        // Cleanup on unmount
        return () => newSocket.close();
    }, []);

    return (
      <div id='main'>
        <Router>
            <Routes>
                <Route path="/" element={<Homepage socket={socket} />} />
                <Route path="/lobby/:gameCode" element={<Lobby socket={socket} />} />
            </Routes>
        </Router>
      </div>
    );

};

export default App;

