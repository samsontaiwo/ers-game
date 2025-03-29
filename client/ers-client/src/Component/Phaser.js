import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { getPlayerPositions } from '../Function/PlayerPositions';
import { createPlayerAvatar, createPlayerNameTag, createCentralPile, createDealingAnimation, createPlayedCardAnimation,
         createCardCountDisplay, updateCardCountDisplay, createPlayerLives, createSlapAnimation, collectCardsAnimation, 
         createBurnCardAnimation, createPileCountDisplay, currentPileCountIncrement, currentPileCountReset, displayPlayerTurn } from '../Function/GameSetup';
import AssetLoader from '../Function/AssetLoader';
import { createGameOverScene } from '../Function/GameOverScene';

const PhaserGame = ({ gameInfo, playerCardCounts, socket, }) => {
    console.log(gameInfo)
    console.log(playerCardCounts)

    const globalPositions = useRef(null);
    
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            scene: {
                preload: preload,
                create: create,
            },
            width: 960,
            height: 700,
            parent: 'phaser-container',
            backgroundColor: '#2F81D6',  
        }

        resizeMain();


        const game = new Phaser.Game(config);

        socket.on('cardPlayed', ({gameId, playerId, result, cardImg}) => {
            const currentScene = game.scene.scenes[0];
            createPlayedCardAnimation(currentScene, cardImg, playerId, globalPositions.current, result.success);
            
            if(result.success === false){
                return;
            }
            socket.emit('getNextTurn', {gameId})

            // displayPlayerTurn(currentScene, globalPositions.current, false, playerId);

            const pileCountIncrement = currentPileCountIncrement(currentScene);

            globalPositions.current.forEach((pos, i) => {
                updateCardCountDisplay(currentScene, pos, playerCardCounts, result.cardCount, playerId);
            })
        })

        socket.on("nextTurn", ({playerId}) => {
            const currentScene = game.scene.scenes[0];
            console.log(playerId, 'just ch')
            displayPlayerTurn(currentScene, globalPositions.current, playerId);


        })

        socket.on('slapResult', ({ gameId, playerId, result }) => {
            const currentScene = game.scene.scenes[0];

            if(!result) return;

            if(result.message === "Invalid slap - no cards to burn"){
                console.log(result.lives);
                globalPositions.current.forEach((pos) => {
                    createPlayerLives(currentScene, pos, result.lives, result.message, playerId);
                })
                return;
            }

            if (currentScene) {
                createSlapAnimation(currentScene, playerId, globalPositions.current);
            }
            if (result.success === true) {
                setTimeout(() => {
                    collectCardsAnimation(currentScene, playerId, globalPositions.current);
                    globalPositions.current.forEach((pos) => {
                        updateCardCountDisplay(currentScene, pos, playerCardCounts, result.count, playerId);
                    });
                    const pileCountReset = currentPileCountReset(currentScene);
                    socket.emit('getNextTurn', {gameId})
                }, 700);
            }else{
                if(result.message === "Invalid slap - card burned" && result.success === false){
                    // createBurnCardAnimation(currentScene, playerId, globalPositions.current);
                }
                globalPositions.current.forEach((pos) => {
                    updateCardCountDisplay(currentScene, pos, playerCardCounts, result.count, playerId);
                });
                const pileCountIncrement = currentPileCountIncrement(currentScene);
            }
        });

        socket.on('challengeWon', ({playerId, cardCount}) => {
            const currentScene = game.scene.scenes[0];
            if (currentScene) {
                collectCardsAnimation(currentScene, playerId, globalPositions.current);
                globalPositions.current.forEach((pos) => {
                    updateCardCountDisplay(currentScene, pos, playerCardCounts, cardCount, playerId);
                });
                const pileCountReset = currentPileCountReset(currentScene);
            }
        });

        socket.on('gameWon', (result) => {
            console.log(result);
            const currentScene = game.scene.scenes[0];
            if (currentScene) {
                // Create game over overlay
                createGameOverScene(currentScene, result.winner);
            }
        });

    

        return () => {
            game.destroy(true);
        }
    }, []);




    function resizeMain() {
        const main = document.getElementById('main');
        main.style.height = '700px';
    }

    function preload() {
        
        const assetLoader = new AssetLoader(this);
        assetLoader.preload();

    }
    

    function create() {
        // createGameOverScene(this, "samsontaiwo");
        this.input.setDefaultCursor('url(assets/images/hand.png), pointer');

        const positions = getPlayerPositions(gameInfo, socket.id);

        if(positions){
            globalPositions.current = positions;
        }

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Create central pile elements
        const { centralPile, pileBorderGraphics, playAreaShadow } = createCentralPile(this);

        // Set up dealing animation
        const { createDealingCard } = createDealingAnimation(this, positions, centerX, centerY, socket);

        // Create player elements
        positions.forEach((pos, i) => {
            createPlayerAvatar(this, pos);
            createPlayerNameTag(this, pos);
            createPlayerLives(this, pos, gameInfo.initalLives);
            createCardCountDisplay(this, pos, playerCardCounts);
            if(pos.player.playerId === localStorage.getItem('gameId')){
                this.triangle  = this.add.image(pos.arrowX, pos.arrowY, 'triangle')
                this.triangle.setDisplaySize(25,25).setAngle(pos.arrowAngle)
            }
        });

        // Handle dealing animation
        const dealCards = () => {
            positions.forEach((pos, index) => {
                createDealingCard(pos, index);
            });
        };

        // Start dealing animation
        const dealInterval = setInterval(dealCards, 100);

        // Clean up after animation
        setTimeout(() => {
            clearInterval(dealInterval);
            centralPile.destroy();
            pileBorderGraphics.destroy();
            

            this.tweens.add({
                targets: playAreaShadow,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
        }, 1000);

        dealCards();

        // Add pile count display
        createPileCountDisplay(this, centerX, centerY);
        
    }


    function update() {
     
    }

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
