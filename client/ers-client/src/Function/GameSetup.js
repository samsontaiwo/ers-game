import Phaser from 'phaser';



export function createPlayerAvatar(scene, pos) {
    // Create player avatar and circles
    const box = scene.add.circle(pos.x, pos.y, 40, 0x00ff00);
    const avatar = scene.add.image(pos.x, pos.y, 'avatar');
    avatar.setDisplaySize(100, 100);

    // Create mask
    const mask = scene.add.circle(pos.x, pos.y, 40);
    const maskGraphics = scene.add.graphics();
    maskGraphics.fillCircle(pos.x, pos.y, 40);
    avatar.setMask(new Phaser.Display.Masks.GeometryMask(scene, maskGraphics));

    // Create circles
    const outerCircle = scene.add.circle(pos.x, pos.y, 50, 0x1062B0);
    outerCircle.setStrokeStyle(4, 0xF4D03F);
    outerCircle.setDepth(-1);

    const backgroundCircle = scene.add.circle(pos.x, pos.y, 11);
    backgroundCircle.setDepth(-8);

    return { box, avatar, outerCircle, backgroundCircle };
}

export function createPlayerNameTag(scene, pos) {
    // Create ribbon and name
    const ribbon = scene.add.image(pos.x, pos.y + 45, 'ribbon');
    ribbon.setDisplaySize(200, 100);

    const playerName = scene.add.text(pos.x, pos.y + 45, pos.player.displayName, {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        shadow: { blur: 2, fill: true }
    });
    playerName.setOrigin(0.5);
    playerName.setDepth(2);

    return { ribbon, playerName };
}

export function createPlayerLives(scene, pos) {
    //Create Life
    const lives = scene.add.image(pos.x, pos.y + 55, 'heart')
    lives.setDisplaySize(50, 50);
    lives.setDepth(10);

    return { lives };
}

export function createCentralPile(scene) {
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    // Create central pile
    const centralPile = scene.add.image(centerX, centerY, 'card');
    scene.centralPile = centralPile;
    centralPile.setDisplaySize(140, 200);

    // Create border
    const pileBorderGraphics = scene.add.graphics();
    pileBorderGraphics.lineStyle(4, 0xFFFFFF);
    pileBorderGraphics.strokeRoundedRect(centerX - 70, centerY - 100, 140, 200, 5);

    // Create shadow
    const playAreaShadow = scene.add.graphics();
    playAreaShadow.fillStyle(0x000000, 0.3);
    playAreaShadow.fillRoundedRect(centerX - 70, centerY - 100, 140, 200, 5);
    playAreaShadow.setAlpha(0);

    return { centralPile, pileBorderGraphics, playAreaShadow };
}


export function createPlayedCardAnimation(currentScene, cardImg, playerId, globalPositions, success) {


    function createCardImage(scene, cardImg, x, y) {
        const card = scene.add.image(x, y, cardImg);  
        card.setDisplaySize(140, 200);
        card.setScale(0);
            scene.tweens.add({
                targets: card,
                scaleX: 0.7,
                scaleY: 0.7,
                duration: 200,
                ease: 'Back.easeOut'
            });
    
        return card;
    }
    // console.log(globalPositions);
    if(success){
        setTimeout(() => {
            globalPositions.forEach((pos, i) => {
                if (pos.player.playerId === playerId) {
                    const tempCard = createCardImage(
                        currentScene,
                        cardImg,
                        pos.cardX,
                        pos.cardY
                    );
                    
                    currentScene.tweens.add({
                        targets: tempCard,
                        x: 480,
                        y: 350,
                        duration: 100,
                        ease: 'Power1',
                        onComplete: () => {
                            // Card remains until further notice
                        }
                    });
                }
            });
            
        }, 100);
    }else if(success === false && globalPositions[0].player.playerId === playerId){
        const notYourTurnText = currentScene.add.text(480, 200, "It's not your turn!", {
            font: 'bold 32px Arial',
            fill: '#ff0000',
            stroke: '#000000', 
            strokeThickness: 4
        });
        notYourTurnText.setOrigin(0.5);
        notYourTurnText.setDepth(1000);

        currentScene.tweens.add({
            targets: notYourTurnText,
            alpha: 0,
            y: 150,
            duration: 1500,
            ease: 'Power1',
            onComplete: () => {
                notYourTurnText.destroy();
            }
        });
    }
}


export function createDealingAnimation(scene, positions, centerX, centerY, socket) {
    const revealedPiles = new Set();

    function createDealingCard(pos, index) {
        const dealingCard = scene.add.image(centerX, centerY - 5, 'card');
        dealingCard.setDisplaySize(140, 200);
        dealingCard.setRotation(0);
        dealingCard.setDepth(100 + index);

        const controlPoint1X = centerX + (pos.cardX - centerX) * 0.25;
        const controlPoint1Y = centerY - 50;
        const controlPoint2X = centerX + (pos.cardX - centerX) * 0.75;
        const controlPoint2Y = pos.cardY - 30;

        scene.tweens.add({
            targets: dealingCard,
            x: {
                value: pos.cardX,
                duration: 750,
                ease: 'Cubic.easeInOut',
                interpolation: function(v, k) {
                    const t = k;
                    return (1 - t) * (1 - t) * (1 - t) * centerX +
                           3 * (1 - t) * (1 - t) * t * controlPoint1X +
                           3 * (1 - t) * t * t * controlPoint2X +
                           t * t * t * pos.cardX;
                }
            },
            y: {
                value: pos.cardY,
                duration: 750,
                ease: 'Cubic.easeInOut',
                interpolation: function(v, k) {
                    const t = k;
                    return (1 - t) * (1 - t) * (1 - t) * (centerY - 5) +
                           3 * (1 - t) * (1 - t) * t * controlPoint1Y +
                           3 * (1 - t) * t * t * controlPoint2Y +
                           t * t * t * pos.cardY;
                }
            },
            rotation: {
                value: Math.PI * 2,
                duration: 750,
                ease: 'Cubic.easeInOut'
            },
            displayWidth: 70,
            displayHeight: 100,
            delay: index * 200,
            onComplete: () => createPermanentPile(pos, index)
        });
    }

    function createPermanentPile(pos, index) {
        if (!revealedPiles.has(index)) {
            revealedPiles.add(index);
            
            const permanentCard = createPermanentCard(pos);
            
            if (index === 0) {
                createSlapButton(permanentCard);
                setupPermanentCardInteractions(permanentCard);
            }
        }
    }

    function createPermanentCard(pos) {
        const permanentCard = scene.add.image(pos.cardX, pos.cardY, 'card');
        permanentCard.setDisplaySize(70, 100);
        return permanentCard;
        

    }

    function createSlapButton(permanentCard) {
        const slapButton = scene.add.image(permanentCard.x + 115, permanentCard.y, 'slap');
        slapButton.setDisplaySize(120, 120);
        slapButton.setInteractive();
        
        let hoverSlap = null;
        
        slapButton.on('pointerdown', () => {
            socket.emit('slap', {
                gameId: localStorage.getItem('gameId'),
                playerId: socket.id,        
            });
            
        });

        slapButton.on('pointerover', () => {
            if (!hoverSlap) {
                hoverSlap = scene.add.image(slapButton.x, slapButton.y, 'slap');
                hoverSlap.setDisplaySize(120, 120);
                hoverSlap.setDepth(1000);

                scene.tweens.add({
                    targets: hoverSlap,
                    scaleX: 1.1,
                    scaleY: 1.2,
                    duration: 150,
                    ease: 'Power1'
                });
            }
        });

        slapButton.on('pointerout', () => {
            if (hoverSlap) {
                hoverSlap.destroy();
                hoverSlap = null;
            }
        });
    }

    function setupPermanentCardInteractions(permanentCard) {
        permanentCard.setInteractive();

        permanentCard.on('pointerdown', () => {
            socket.emit('playCard', {
                playerId: socket.id,
                gameId: localStorage.getItem('gameId')
            });
        
        });
    }

    return { createDealingCard, revealedPiles };
}

export function createCardCountDisplay(scene, pos, playerCardCounts, cardCount) {
    // await new Promise(resolve => setTimeout(resolve, 500));

    // Find card count for this player
    const count = playerCardCounts.find(pc => pc.playerId === pos.player.playerId)?.cardCount || 0;
    
    // Create the dark circle
    const cardCountCircle = scene.add.circle(pos.cardX, pos.cardY, 26, 0x202020);
    cardCountCircle.setAlpha(0.7);
    cardCountCircle.setDepth(10000);

    // Add count text
    const cardCountText = scene.add.text(pos.cardX, pos.cardY, count.toString(), {
        font: 'bold 20px Arial',
        fill: '#ffffff'
    });
    cardCountText.setOrigin(0.5);
    cardCountText.setDepth(10001);

    return { cardCountCircle, cardCountText };
}


export function updateCardCountDisplay(scene, pos, playerCardCounts, cardCount, playerId) {


    const check = pos.player.playerId === playerId;
    if(check === false){
        return;
    }else{
        let x = pos.cardX;
        let y = pos.cardY;
        const existingCircle = scene.children.list.find(child => 
            child.type === 'Arc' && 
            child.x === x && 
            child.y === y
        );
    
        const existingText = scene.children.list.find(child =>
            child.type === 'Text' &&
            child.x === x &&
            child.y === y
        );

    
        if (existingCircle && existingText) {
            // Update existing text
            existingText.setText(cardCount.toString());
            return { cardCountCircle: existingCircle, cardCountText: existingText };
        }
    }
}

export function createSlapAnimation(scene, playerId, positions) {
    const playerPosition = positions.find(pos => pos.player.playerId === playerId);
    if (!playerPosition) return;

    // Calculate center of the pile
    const centerX = 490; 
    const centerY = 350;
    
    // Create hand at player position
    const handSlap = scene.add.image(playerPosition.x, playerPosition.y, 'hand');
    handSlap.setDisplaySize(200, 200);
    handSlap.setDepth(1000);
    
    // Animate hand from player to center pile
    scene.tweens.add({
        targets: handSlap,
        x: centerX,
        y: centerY,
        duration: 200,
        ease: 'Power2',
        onComplete: () => {
            // Add impact effect at center
            const slapImpact = scene.add.image(centerX, centerY, 'hand');
            slapImpact.setDisplaySize(200, 200);
            slapImpact.setAlpha(0.8);
            slapImpact.setDepth(999);

            scene.time.delayedCall(500, () => {
                scene.tweens.add({
                    targets: [handSlap, slapImpact],
                    alpha: 0,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 200,
                    ease: 'Power2',
                    onComplete: () => {
                        handSlap.destroy();
                        slapImpact.destroy();
                    }
                });
            });
        }
    });
}

export function collectCardsAnimation(scene, playerId, positions) {
    const centerX = 480;
    const centerY = 350;
    
    // Find all cards in the pile
    const pileCards = scene.children.list.filter(child => 
        child.type === 'Image' && 
        child.x === centerX &&
        child.y === centerY &&
        child.texture.key !== 'card' // Not a card back
    );


    if (pileCards.length > 0) {
        // Get target position (the player's card pile position)
        const playerPosition = positions.find(pos => pos.player.playerId === playerId);
        
        // Animate all cards flip and movement
        pileCards.forEach((card, index) => {
            scene.tweens.add({
                targets: card,
                scaleX: 0,
                duration: 150,
                onComplete: () => {
                    // Change texture to card back when fully scaled to 0
                    card.setTexture('card');
                    
                    // Animate scale back and move to player position
                    scene.tweens.add({
                        targets: card,
                        scaleX: 1,
                        scaleY: 1,
                        displayWidth: 70,
                        displayHeight: 100,
                        x: playerPosition.cardX,
                        y: playerPosition.cardY,
                        duration: 300,
                        ease: 'Power1',
                        onComplete: () => {
                            card.destroy();
                        }
                    });
                }
            });
        });
    }
}

export function createTurnTimer(scene, playerId, positions) {
    const playerPosition = positions.find(pos => pos.player.playerId === playerId);
    if (!playerPosition) return;

    // Create a circle around the player's card pile
    const timerCircle = scene.add.circle(
        playerPosition.cardX,
        playerPosition.cardY,
        45,  // radius
        0xffffff,  // color (white)
        0.5   // alpha
    );
    timerCircle.setDepth(999);

    // Add pulsing animation
    scene.tweens.add({
        targets: timerCircle,
        alpha: { from: 0.5, to: 0 },
        duration: 1000,
        repeat: 2,  // 3 seconds total
        ease: 'Sine.easeInOut',
        onComplete: () => {
            timerCircle.destroy();
        }
    });

    return timerCircle;
}

export function createBurnCardAnimation(scene, playerId, positions) {
    const playerPosition = positions.find(pos => pos.player.playerId === playerId);
    if (!playerPosition) return;

    // Create card back at player's position
    const burnCard = scene.add.image(playerPosition.cardX, playerPosition.cardY, 'card');
    burnCard.setDisplaySize(70, 100); // Start with same size as player's pile
    burnCard.setDepth(1000); // Start behind the pile

    // Calculate center position
    const centerX = 480;
    const centerY = 350;

    // First tween: Lift card slightly up and forward
    scene.tweens.add({
        targets: burnCard,
        // y: playerPosition.cardY - 20, // Lift up slightly
        depth: 999, // Bring forward temporarily
        duration: 3000,
        ease: 'Power1',
        onComplete: () => {
            // Second tween: Move to center while adjusting size
            scene.tweens.add({
                targets: burnCard,
                x: centerX,
                y: centerY,
                displayWidth: 160, // Match center pile size
                displayHeight: 220,
                depth: 0.1, // Move behind pile again
                duration: 400,
                ease: 'Power1',
                onComplete: () => {
                    // Fade out
                    scene.tweens.add({
                        targets: burnCard,
                        alpha: 0,
                        duration: 200,
                        ease: 'Power2',
                        onComplete: () => {
                            burnCard.destroy();
                        }
                    });
                }
            });
        }
    });
}