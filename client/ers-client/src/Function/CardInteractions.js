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

        // Create the moving card
        const movingCard = scene.add.image(position.x, position.y - 5, 'backOfCard')
            .setDisplaySize(slotWidth, slotHeight)
            .setDepth(1);

        // Move the card toward the pile
        scene.tweens.add({
            targets: movingCard,
            x: centerX,
            y: centerY,
            scaleX: 0.8,  // Slight shrink effect
            scaleY: 0.8,
            angle: 180,   // Half-spin
            duration: 800,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                // Flip animation (shrink width to 0)
                scene.tweens.add({
                    targets: movingCard,
                    scaleX: 0,
                    duration: 300,
                    ease: 'Linear',
                    onComplete: () => {
                        // Change texture when fully flipped
                        if (currCardImgRef.current) {
                            movingCard.setTexture(currCardImgRef.current);
                        }

                        // Expand width back (flip effect)
                        scene.tweens.add({
                            targets: movingCard,
                            scaleX: 0.8,
                            duration: 300,
                            ease: 'Linear',
                            onComplete: () => {
                                // Final move onto pile
                                scene.tweens.add({
                                    targets: movingCard,
                                    scaleX: 1,
                                    scaleY: 1,
                                    duration: 300,
                                    ease: 'Quad.easeOut',
                                    onComplete: () => {
                                        // Update pile texture
                                        pileRef.current.setTexture(currCardImgRef.current);
                                        movingCard.destroy(); // Remove moving card
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    if (playerOrder[0] === socket.id) {
        if (!scene.textures.exists('LH') || !scene.textures.exists('RH')) {
            console.error('LH or RH texture not loaded yet!');
            return;
        }

        const leftHand = scene.add.image(450, 765, 'LH')
            .setDisplaySize(slotWidth, slotHeight)
            .setDepth(2)
            .setInteractive();

        const rightHand = scene.add.image(750, 765, 'RH')
            .setDisplaySize(slotWidth, slotHeight)
            .setDepth(2)
            .setInteractive();

        const leftHandOriginal = { x: leftHand.x, y: leftHand.y };
        const rightHandOriginal = { x: rightHand.x, y: rightHand.y };

        let hasSlapped = false; // Flag to prevent repeated slap actions

        scene.input.setDraggable([leftHand, rightHand]);

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;

            // Only trigger the slap once
            if (gameObject === rightHand && !hasSlapped && isOverlapping(gameObject, pileRef.current)) {
                console.log("Slap detected!");
                socket.emit('slap', { gameId: players[0], playerId: socket.id });
                hasSlapped = true; // Set flag to true after slap action
            }
        });

        scene.input.on('dragend', (pointer, gameObject) => {
            scene.tweens.add({
                targets: gameObject,
                x: gameObject === leftHand ? leftHandOriginal.x : rightHandOriginal.x,
                y: gameObject === leftHand ? leftHandOriginal.y : rightHandOriginal.y,
                duration: 300,
                ease: 'Quad.easeOut'
            });

            // Reset flag when dragging ends, allowing for the slap action again if needed
            if (gameObject === rightHand) {
                hasSlapped = false; // Reset after drag ends to allow future slaps
            }
        });

        function isOverlapping(hand, pile) {
            if (!pile) return false; // Ensure pile exists

            const handBounds = hand.getBounds();
            const pileBounds = pile.getBounds();

            return Phaser.Geom.Intersects.RectangleToRectangle(handBounds, pileBounds);
        }
    }
}
