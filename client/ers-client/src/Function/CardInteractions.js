import Phaser from "phaser";
import { createLeftHand } from "./LeftHandInteraction";

export function addCardInteractions(scene, cardBack, position, slotWidth, slotHeight, centerX, centerY, socket, players, currCardImgRef, pileRef, playerOrder) {
    // Create a copy of the card for the hover effect (tilted)
    const cardTilt = scene.add.image(position.x, position.y, 'backOfCard')
        .setDisplaySize(slotWidth, slotHeight)
        .setAlpha(0) // Initially hidden
        .setDepth(1); // Make sure it appears on top

    // Add hover effect (rotation) on cardBack by tilting the copy
    cardBack.on('pointerover', () => {
        cardTilt.setAlpha(1);  // Show the tilted card
        scene.tweens.add({
            targets: cardTilt,
            angle: 25,  // Slight rotation to indicate hover
            duration: 200,
            ease: 'Power2'
        });
    });

    cardBack.on('pointerout', () => {
        scene.tweens.add({
            targets: cardTilt,
            angle: 0,  // Reset rotation
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                cardTilt.setAlpha(0);  // Hide the tilted card
            }
        });
    });

    // Handle clicking the card (Slap/Play)
    cardBack.on('pointerdown', () => {
        console.log(`${players[0]} played a card!`);

        // Emit event to the server
        socket.emit('playCard', {
            gameId: players[0], playerId: socket.id
        });

    });

    createLeftHand(scene, position, slotWidth, slotHeight, socket, playerOrder);

    

    
    
}
