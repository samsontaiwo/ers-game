import { getPlayerPositions } from "./PlayerPositions";
import { getPlayerOrder } from "./PlayerOrder";
import { assignSpot } from "./assignSpot";

export function animateCardFlip(playerId, cardImg, players, game, pileRef, socket) {
    console.log(playerId, 'animating debugging');

    // Check if the Phaser game instance and scene are fully initialized
    if (!game || !game.scene || !game.scene.scenes[0]) {
        console.error("Phaser scene is not initialized yet.");
        return;
    }

    const scene = game.scene.scenes[0];  // Access the Phaser scene
    const cameraWidth = scene.cameras.main.width;
    const cameraHeight = scene.cameras.main.height;
    const positions = assignSpot(players, socket.id,  cameraWidth, cameraHeight)

    // Ensure position has proper x and y coordinates
    console.log('Player Position:', positions);

    // Create the moving card and animate it
    const movingCard = scene.add.image(positions[playerId].x, positions[playerId].y - 5, 'backOfCard')
        .setDisplaySize(100, 150)
        .setDepth(1);

    // Card movement and flip animation
    scene.tweens.add({
        targets: movingCard,
        x: scene.cameras.main.width / 2,
        y: scene.cameras.main.height / 2,
        scaleX: 0.8,   // Shrink the card to 80%
        scaleY: 0.8,   // Shrink the card to 80%
        angle: 180,    // Half-spin for flip effect
        duration: 800,
        ease: 'Quad.easeInOut',
        onComplete: () => {
            scene.tweens.add({
                targets: movingCard,
                scaleX: 0,    // Shrink to 0 for flip effect
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    if (cardImg) {
                        movingCard.setTexture(cardImg);  // Change texture after flip
                    }

                    scene.tweens.add({
                        targets: movingCard,
                        scaleX: 0.8,  // Bring back the size to 80%
                        duration: 300,
                        ease: 'Linear',
                        onComplete: () => {
                            scene.tweens.add({
                                targets: movingCard,
                                scaleX: 1,    // Return to original size
                                scaleY: 1,    // Return to original size
                                duration: 300,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    if (pileRef.current) {
                                        pileRef.current.setTexture(cardImg);  // Update pile texture
                                    }
                                    movingCard.destroy();  // Remove the card after animation
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
