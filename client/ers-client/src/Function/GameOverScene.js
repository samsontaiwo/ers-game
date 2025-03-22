export function createGameOverScene(scene, winner) {
    // Semi-transparent dark overlay with fade in
    const overlay = scene.add.rectangle(0, 0, 960, 700, 0x000000, 1);
    overlay.setOrigin(0);
    overlay.setDepth(100000);
    overlay.alpha = 0;

    // Game Over text starts way above screen
    const gameOverText = scene.add.text(480, -200, 'GAME OVER', {
        fontSize: '64px',
        fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
        color: '#FFFFFF',
        fontWeight: 'bold'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(1000001);

    // Winner text starts completely off screen to the right
    const winnerText = scene.add.text(1200, 350, `${winner.displayName} Wins!`, {
        fontSize: '32px',
        fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
        color: '#C49B72'
    });
    winnerText.setOrigin(0.5);
    winnerText.setDepth(1000001);

    // Play Again button starts invisible
    const playAgainButton = scene.add.text(480, 450, 'Play Again', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#1FAB1C',
        padding: { x: 20, y: 10 },
        borderRadius: { tl: 50, tr: 50, bl: 50, br: 50 }
    ,
    
    });
    playAgainButton.setOrigin(0.5);
    playAgainButton.setInteractive({ useHandCursor: true });
    playAgainButton.setDepth(1000001);
    playAgainButton.setScale(0);
    playAgainButton.alpha = 0;

    // Animation sequence
    scene.tweens.add({
        targets: overlay,
        alpha: { from: 0, to: 1 },
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
            // Drop in Game Over text with bounce
            scene.tweens.add({
                targets: gameOverText,
                y: 250,
                duration: 800,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    // Slide in winner text
                    scene.tweens.add({
                        targets: winnerText,
                        x: 480,
                        duration: 600,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            // Pop up play again button
                            scene.tweens.add({
                                targets: playAgainButton,
                                scaleX: 1,
                                scaleY: 1,
                                alpha: 1,
                                duration: 400,
                                ease: 'Back.easeOut'
                            });
                        }
                    });
                }
            });
        }
    });

    // Enhanced button hover effects
    playAgainButton.on('pointerover', () => {
        scene.tweens.add({
            targets: playAgainButton,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            ease: 'Power1'
        });
        playAgainButton.setStyle({ color: '#1FAB1C', backgroundColor: '#ffffff' });
    });

    playAgainButton.on('pointerout', () => {
        scene.tweens.add({
            targets: playAgainButton,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: 'Power1'
        });
        playAgainButton.setStyle({ color: '#ffffff', backgroundColor: '#4CAF50' });
    });

    playAgainButton.on('pointerdown', () => {
        window.location.href = '/';
    });

    return { overlay, gameOverText, winnerText, playAgainButton };
} 