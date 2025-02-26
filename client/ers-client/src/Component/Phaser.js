import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import Octagon from '../Function/Octagon';
import AssetLoader from '../Function/AssetLoader';
import { getPlayerPositions } from '../Function/PlayerPositions';
import { getPlayerOrder } from '../Function/PlayerOrder';
import { addCardInteractions } from '../Function/CardInteractions';

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

        const assetLoader = new AssetLoader(this);  // Create instance of AssetLoader
        assetLoader.preload();  // Preload all assets

    }
    

    function create() {

        // Create player order, illusion
        const playerOrder = getPlayerOrder(players, socket.id);

        // Create an instance of Octagon and call its create method
        const octagon = new Octagon(this);
        octagon.create();  // Draw the octagonal board

        // Slot Styling
        const slotWidth = 100;
        const slotHeight = 150;
        const padding = 145; // Padding for 50px from the edges

        // Get the center of the canvas
        const centerX = this.cameras.main.width / 2; // 500
        const centerY = this.cameras.main.height / 2; // 400

        const totalPlayers = players.length || 1; // Ensure at least one player

        // Determine positions based on the number of players
        const positions = getPlayerPositions(players.length, centerX, centerY, padding, this.cameras.main.width, this.cameras.main.height);

        // Create player slots at the determined positions
        positions.forEach((position, index) => {
            this.add.text(position.x-95, position.y+85, playerOrder[index], { font: '16px Arial', fill: '#000000' }); // adds player's socket.id
            this.add.rectangle(position.x, position.y, slotWidth, slotHeight, 0x0000ff).setAlpha(0.5);

            // Add the card back image and scale it to fit inside the allocated slot
            const cardBack = this.add.image(position.x, position.y, 'backOfCard').setInteractive();
            cardBack.setDisplaySize(slotWidth, slotHeight); // Scale image to match the slot size

           
            const cardTilt = this.add.image(position.x, position.y - 5, 'backOfCard');  // Slightly offset vertically
            cardTilt.setDisplaySize(slotWidth, slotHeight); // Make the tilt card match the size
            cardTilt.setAlpha(0);  // Initially hidden, only show when hovered

            addCardInteractions(this, cardBack, position, slotWidth, slotHeight, centerX, centerY, socket, players, currCardImgRef, pileRef, playerOrder);


            
            // Create the pile in the center of the board (Initially gray)
            const pileWidth = 150;
            const pileHeight = 250;
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
            pileRef.current.setDisplaySize(150, 250); // Resize to fit the container
            pileRef.current.setTexture(currCardImgRef.current);  // Set the new texture
        }
    }

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
