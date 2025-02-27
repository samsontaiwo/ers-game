import Phaser from "phaser";

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

    
    if (playerOrder[0] === socket.id) {
        if (!scene.textures.exists('LH')) {
            console.error('LH texture not loaded yet!');
            return;
        }
    
        const leftHand = scene.add.image(450, 765, 'LH')
            .setDisplaySize(slotWidth, slotHeight)
            .setDepth(2)
            .setInteractive()
            .on('pointerdown', () => handleHandClick(leftHand));
    
        const leftHandOriginal = { x: leftHand.x, y: leftHand.y };
    
        // Handle the left hand click animation
        function handleHandClick(hand) {
            const centerX = scene.cameras.main.width / 2;
            const centerY = scene.cameras.main.height / 2;
    
            // Animate the hand to the center
            scene.tweens.add({
                targets: hand, // Animate the actual image
                x: centerX,
                y: centerY,
                duration: 500, // Time to move to the center
                ease: 'Quad.easeInOut',
                onComplete: () => {
                    // Wait for 2 seconds before returning to the original position
                    scene.time.delayedCall(2000, () => {
                        // Animate the hand back to its original position
                        scene.tweens.add({
                            targets: hand, // Animate the actual image
                            x: leftHandOriginal.x,
                            y: leftHandOriginal.y,
                            duration: 500, // Time to return to the original position
                            ease: 'Quad.easeOut'
                        });
                    });
    
                    // Trigger the slap action when hand reaches the center
                    console.log("Slap detected!");
                    socket.emit('slap', { gameId: players[0], playerId: socket.id });
                }
            });
        }
    }
    
    
    
}
