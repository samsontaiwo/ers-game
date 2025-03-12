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
        // Add a centered semi-transparent circle overlaying the card
        // const circle = scene.add.circle(pos.cardX, pos.cardY, 26, 0x202020); //0x000000, 0 this is for transparency
        // circle.setAlpha(0.7);
        // circle.setDepth(10000); // Ensure circle appears above the card
        permanentCard.setDisplaySize(70, 100);
        return permanentCard;
        

    }

    function createSlapButton(permanentCard) {
        const slapButton = scene.add.image(permanentCard.x + 115, permanentCard.y, 'slap');
        slapButton.setDisplaySize(120, 120);
        slapButton.setInteractive();
        
        let hoverSlap = null;
        
        slapButton.on('pointerdown', () => {
            console.log('slapped');
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
        // let hoverCard = null;

        // function createHoverCard() {
        //     hoverCard = scene.add.image(permanentCard.x, permanentCard.y, 'card');
        //     hoverCard.setDisplaySize(70, 100);
        //     hoverCard.setDepth(permanentCard.depth + 1000);

        //     scene.tweens.add({
        //         targets: hoverCard,
        //         scaleX: 0.5,
        //         scaleY: 0.5,
        //         y: permanentCard.y - 25,
        //         duration: 150,
        //         ease: 'Power1'
        //     });
        // }

        // permanentCard.on('pointerover', () => {
        //     if (!hoverCard) {
        //         createHoverCard();
        //     }
        // });

        // permanentCard.on('pointerout', () => {
        //     if (hoverCard) {
        //         hoverCard.destroy();
        //         hoverCard = null;
        //     }
        // });

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
        console.log(existingCircle, 'existingCircle')
        console.log(existingText.text, 'existingText')
    
        if (existingCircle && existingText) {
            console.log('hello from the other side');
            // Update existing text
            existingText.setText(cardCount.toString());
            return { cardCountCircle: existingCircle, cardCountText: existingText };
        }
    }
}