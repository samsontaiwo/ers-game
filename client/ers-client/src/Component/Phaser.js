import React, { useEffect } from 'react';
import Phaser from 'phaser';
// import '../App.css';

const PhaserGame = ({ players }) => {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 1600,
            height: 800,
            parent: 'phaser-container', // This must match the div ID
            scene: {
                preload,
                create,
                update
            },
            backgroundColor: '#7FFFD4',
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, [players]); // Reinitialize Phaser if players change

    function preload() {
        this.load.image('backOfCard', 'http://localhost:3001/assets/images/backofcard.jpg');
    }

    function create() {
        const slotWidth = 100;
        const slotHeight = 150;
        const padding = 125; // Padding for 50px from the edges
    
        // Get the center of the canvas
        const centerX = this.cameras.main.width / 2; //500
        const centerY = this.cameras.main.height / 2; //400
    
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
    
        // Create player slots at the determined positions
        positions.forEach((position, index) => {
            this.add.text(position.x - 30, position.y - 80, players[index].name, { font: '16px Arial', fill: '#fff' });
            this.add.rectangle(position.x, position.y, slotWidth, slotHeight, 0x0000ff).setAlpha(0.5);
    
            // Add the card back image and scale it to fit inside the allocated slot
            const cardBack = this.add.image(position.x, position.y, 'backOfCard').setInteractive();
            cardBack.setDisplaySize(slotWidth, slotHeight); // Scale image to match the slot size
        });

        this.cameras.main.setBackgroundColor('#7FFFD4');
    }
    
    
    

    function update() {
        // Future updates go here
    }

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
