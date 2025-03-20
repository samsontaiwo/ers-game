# Egyptian Rat Screw (ERS) Multiplayer Card Game

A real-time multiplayer card game built with Node.js, Socket.IO, and Phaser 3. This project implements the classic Egyptian Rat Screw card game with modern web technologies and smooth animations.

## Technologies Used

- **Frontend:**
  - React.js
  - Phaser 3 (Game Engine)
  - Socket.IO Client
  - CSS3 Animations

- **Backend:**
  - Node.js
  - Express
  - Socket.IO
  - Custom Game State Management

## Features

### Real-time Multiplayer
- Seamless multiplayer experience using WebSocket connections
- Support for 2-4 players
- Real-time game state synchronization
- In-game chat system

### Game Mechanics
- Complete implementation of Egyptian Rat Screw rules
- Face card challenges (Jack, Queen, King, Ace)
- Slapping mechanics with visual feedback
- Card burning system for invalid slaps
- Automatic turn progression

### Visual Features
- Dynamic card animations
- Player avatars and nameplates
- Card count display
- Visual feedback for game events:
  - Card plays
  - Successful/failed slaps
  - Face card challenges
  - Card collection animations

### User Interface
- Intuitive lobby system
- Game creation and joining functionality
- Responsive design
- Custom cursor and interactive elements
- Real-time player status updates

## Technical Highlights

- **State Management:**
  - Centralized game state handling on the server
  - Efficient state synchronization across clients
  - Robust error handling and game flow control

- **Animation System:**
  - Custom animation pipeline using Phaser 3
  - Smooth transitions and effects
  - Optimized rendering performance

- **Networking:**
  - Low-latency Socket.IO implementation
  - Efficient event handling
  - Reliable game state updates

## Architecture

The application follows a client-server architecture:

## Future Enhancements

- Player statistics and leaderboards
- Custom game rules configuration
- Spectator mode
- Mobile responsiveness
- Sound effects and background music

## Development

To run the project locally:

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
cd client && npm install
cd server && npm install

# Start the server
cd server && npm start

# Start the client
cd client && npm start
```

## Credits

Developed by Ayomide Samson Taiwo




