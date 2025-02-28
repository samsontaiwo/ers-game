// handAnimation.js

export function handleHandClick(hand, scene, socket, players, leftHandOriginal) {


    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;

    // Animate the hand to the center
    scene.tweens.add({
        targets: hand,
        x: centerX,
        y: centerY,
        duration: 500,
        ease: 'Quad.easeInOut',
        onComplete: () => {
            // Wait for 2 seconds before returning to the original position
            scene.time.delayedCall(2000, () => {
                // Animate the hand back to its original position
                scene.tweens.add({
                    targets: hand,
                    x: leftHandOriginal.x,
                    y: leftHandOriginal.y,
                    duration: 500,
                    ease: 'Quad.easeOut'
                });
            });

            // Trigger the slap action when hand reaches the center
            console.log("Slap detected!");
            // socket.emit('slap', { gameId: players[0], playerId: socket.id });
        }
    });
}
