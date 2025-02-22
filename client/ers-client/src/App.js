import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Component/Homepage';
import Lobby from './Component/Lobby'; 

const App = () => {
  return (
    <Router>
      <div>
        hello there child
        <Routes>  
          <Route path="/" element={<Homepage />} />  
          <Route path="/lobby/:gameCode" element={<Lobby />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;

