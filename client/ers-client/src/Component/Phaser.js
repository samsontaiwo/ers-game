import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame = ({ players, socket }) => {

    const currCardImgRef = useRef(''); // Create a ref instead of state
    const [pileCardImage, setPileCardImage] = useState(null); // State to track the pile card image
    const pileRef = useRef(null); // Reference to store the pile image

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 1200,
            height: 900,
            parent: 'phaser-container', // This must match the div ID
            scene: {
                preload,
                create,
                update
            },
        };

        const game = new Phaser.Game(config);

        socket.on('cardPlayed', ({ gameId, playerId, result, cardImg }) => {
            if (result.success === false) return;

            // Directly use the image URL
            currCardImgRef.current = cardImg;
            
        });

        return () => {
            game.destroy(true);
        };
    }, [players]); // Reinitialize Phaser if players change


    

  

    function preload() {
        // Load the back of the card
        this.load.image('backOfCard', 'http://localhost:3001/assets/images/backofcard.jpg');
    
        // Load all the card images (52 cards + 2 jokers)
        this.load.image('AS', 'https://deckofcardsapi.com/static/img/AS.png');
        this.load.image('2S', 'https://deckofcardsapi.com/static/img/2S.png');
        this.load.image('3S', 'https://deckofcardsapi.com/static/img/3S.png');
        this.load.image('4S', 'https://deckofcardsapi.com/static/img/4S.png');
        this.load.image('5S', 'https://deckofcardsapi.com/static/img/5S.png');
        this.load.image('6S', 'https://deckofcardsapi.com/static/img/6S.png');
        this.load.image('7S', 'https://deckofcardsapi.com/static/img/7S.png');
        this.load.image('8S', 'https://deckofcardsapi.com/static/img/8S.png');
        this.load.image('9S', 'https://deckofcardsapi.com/static/img/9S.png');
        this.load.image('0S', 'https://deckofcardsapi.com/static/img/0S.png');
        this.load.image('JS', 'https://deckofcardsapi.com/static/img/JS.png');
        this.load.image('QS', 'https://deckofcardsapi.com/static/img/QS.png');
        this.load.image('KS', 'https://deckofcardsapi.com/static/img/KS.png');
    
        this.load.image('AH', 'https://deckofcardsapi.com/static/img/AH.png');
        this.load.image('2H', 'https://deckofcardsapi.com/static/img/2H.png');
        this.load.image('3H', 'https://deckofcardsapi.com/static/img/3H.png');
        this.load.image('4H', 'https://deckofcardsapi.com/static/img/4H.png');
        this.load.image('5H', 'https://deckofcardsapi.com/static/img/5H.png');
        this.load.image('6H', 'https://deckofcardsapi.com/static/img/6H.png');
        this.load.image('7H', 'https://deckofcardsapi.com/static/img/7H.png');
        this.load.image('8H', 'https://deckofcardsapi.com/static/img/8H.png');
        this.load.image('9H', 'https://deckofcardsapi.com/static/img/9H.png');
        this.load.image('0H', 'https://deckofcardsapi.com/static/img/0H.png');
        this.load.image('JH', 'https://deckofcardsapi.com/static/img/JH.png');
        this.load.image('QH', 'https://deckofcardsapi.com/static/img/QH.png');
        this.load.image('KH', 'https://deckofcardsapi.com/static/img/KH.png');
    
        this.load.image('AD', 'https://deckofcardsapi.com/static/img/AD.png');
        this.load.image('2D', 'https://deckofcardsapi.com/static/img/2D.png');
        this.load.image('3D', 'https://deckofcardsapi.com/static/img/3D.png');
        this.load.image('4D', 'https://deckofcardsapi.com/static/img/4D.png');
        this.load.image('5D', 'https://deckofcardsapi.com/static/img/5D.png');
        this.load.image('6D', 'https://deckofcardsapi.com/static/img/6D.png');
        this.load.image('7D', 'https://deckofcardsapi.com/static/img/7D.png');
        this.load.image('8D', 'https://deckofcardsapi.com/static/img/8D.png');
        this.load.image('9D', 'https://deckofcardsapi.com/static/img/9D.png');
        this.load.image('0D', 'https://deckofcardsapi.com/static/img/0D.png');
        this.load.image('JD', 'https://deckofcardsapi.com/static/img/JD.png');
        this.load.image('QD', 'https://deckofcardsapi.com/static/img/QD.png');
        this.load.image('KD', 'https://deckofcardsapi.com/static/img/KD.png');
    
        this.load.image('AC', 'https://deckofcardsapi.com/static/img/AC.png');
        this.load.image('2C', 'https://deckofcardsapi.com/static/img/2C.png');
        this.load.image('3C', 'https://deckofcardsapi.com/static/img/3C.png');
        this.load.image('4C', 'https://deckofcardsapi.com/static/img/4C.png');
        this.load.image('5C', 'https://deckofcardsapi.com/static/img/5C.png');
        this.load.image('6C', 'https://deckofcardsapi.com/static/img/6C.png');
        this.load.image('7C', 'https://deckofcardsapi.com/static/img/7C.png');
        this.load.image('8C', 'https://deckofcardsapi.com/static/img/8C.png');
        this.load.image('9C', 'https://deckofcardsapi.com/static/img/9C.png');
        this.load.image('0C', 'https://deckofcardsapi.com/static/img/0C.png');
        this.load.image('JC', 'https://deckofcardsapi.com/static/img/JC.png');
        this.load.image('QC', 'https://deckofcardsapi.com/static/img/QC.png');
        this.load.image('KC', 'https://deckofcardsapi.com/static/img/KC.png');
    

    }
    

    function create() {
        // Styling background color
        this.cameras.main.setBackgroundColor('#D3D3D3');

        const slotWidth = 100;
        const slotHeight = 150;
        const padding = 125; // Padding for 50px from the edges

        // Get the center of the canvas
        const centerX = this.cameras.main.width / 2; // 500
        const centerY = this.cameras.main.height / 2; // 400

        const totalPlayers = players.length || 1; // Ensure at least one player

        // Determine positions based on the number of players
        let positions = [];

        if (totalPlayers === 1) {
            positions = [
                { x: centerX, y: this.cameras.main.height - padding } // Single player at the bottom
            ];
        } else if (totalPlayers === 2) {
            positions = [
                { x: centerX, y: this.cameras.main.height - padding }, // Bottom
                { x: centerX, y: padding }  // Top
            ];
        } else if (totalPlayers === 3) {
            positions = [
                { x: centerX, y: this.cameras.main.height - padding }, // Bottom
                { x: padding, y: centerY }, // Left
                { x: centerX, y: padding }  // Top
            ];
        } else if (totalPlayers === 4) {
            positions = [
                { x: centerX, y: this.cameras.main.height - padding }, // Bottom
                { x: padding, y: centerY }, // Left
                { x: centerX, y: padding },  // Top
                { x: this.cameras.main.width - padding, y: centerY }  // Right (50px from the right)
            ];
        }

        // Create player order, illusion
        let playerOrder = [];
        let playerIndex = players.indexOf(socket.id);
        if (playerIndex !== 0) {
            playerOrder = [...players.slice(playerIndex), ...players.slice(0, playerIndex)];
        } else {
            playerOrder = players;
        }

        // Create player slots at the determined positions
        positions.forEach((position, index) => {
            this.add.text(position.x + 50, position.y, playerOrder[index], { font: '16px Arial', fill: '#000000' }); // adds player's socket.id
            this.add.rectangle(position.x, position.y, slotWidth, slotHeight, 0x0000ff).setAlpha(0.5);

            // Add the card back image and scale it to fit inside the allocated slot
            const cardBack = this.add.image(position.x, position.y, 'backOfCard').setInteractive();
            cardBack.setDisplaySize(slotWidth, slotHeight); // Scale image to match the slot size

            // Add Slap Button
            const slapButton = this.add.text(position.x - slotWidth / 2, position.y + slotHeight / 2 + 20, 'Slap', { font: '16px Arial', fill: '#ff0000' })
                .setInteractive()
                .on('pointerdown', () => {
                    console.log(`${players[index]} slapped!`);
                    // Add logic for Slap action here
                });

            // Add Flip Button
            const flipButton = this.add.text(position.x + slotWidth / 2, position.y + slotHeight / 2 + 20, 'Flip', { font: '16px Arial', fill: '#0000ff' })
                .setInteractive()
                .on('pointerdown', () => {
                    console.log(`${players[index]} flipped!`);
                    // Emit the playCard event on click
                    socket.emit('playCard', {
                        gameId: players[0], playerId: socket.id
                    });
                });

            // Create the pile in the center of the board (Initially gray)
            const pileWidth = 100;
            const pileHeight = 150;
            const pileX = centerX; // Center horizontally
            const pileY = centerY; // Center vertically

            // Add a visual representation of the pile (initially gray)
            const pileRectangle = this.add.rectangle(pileX, pileY, pileWidth, pileHeight, 0x888888).setAlpha(0.7); // Gray pile
            pileRef.current = this.add.image(pileX, pileY, ).setDisplaySize(pileWidth, pileHeight);
        
           
        });
    }


    function update() {
        if (pileRef.current && currCardImgRef.current) {
    
            // Get the width and height of the pile container
            const pileWidth = pileRef.current.displayWidth;
            const pileHeight = pileRef.current.displayHeight;
    
            // Resize the image to fit inside the pile container while maintaining its aspect ratio
            pileRef.current.setDisplaySize(100, 150); // Resize to fit the container
            pileRef.current.setTexture(currCardImgRef.current);  // Set the new texture
        }
    }

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
