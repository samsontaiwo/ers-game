import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io client
import Homepage from './Component/Homepage';
import Lobby from './Component/Lobby';
import './App.css';
import Gameplay from './Component/Gameplay';
import Rules from './Component/Rules';

const App = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize the socket only once
        const newSocket = io('https://ers-game.onrender.com'); // Replace with your server URL
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
                <Route path="/gameplay/:gameCode/live-gameplay" element={<Gameplay socket={socket}/>}/>
                <Route path="/rules" element={<Rules/>}/>
            </Routes>
        </Router>
      </div>
    );

};

export default App;

