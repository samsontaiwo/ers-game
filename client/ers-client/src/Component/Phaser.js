import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { getPlayerPositions } from '../Function/PlayerPositions';
import { createPlayerAvatar, createPlayerNameTag, createCentralPile, createDealingAnimation, createPlayedCardAnimation, createCardCountDisplay, updateCardCountDisplay, createPlayerLives, createSlapAnimation, collectCardsAnimation, createTurnTimer, createBurnCardAnimation } from '../Function/GameSetup';
import AssetLoader from '../Function/AssetLoader';

const PhaserGame = ({ gameInfo, playerCardCounts, socket }) => {
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
            backgroundColor: '#2F81D6',   //1062B0
        }

        resizeMain();


        const game = new Phaser.Game(config);

        socket.on('cardPlayed', ({gameId, playerId, result, cardImg}) => {
            const currentScene = game.scene.scenes[0];
            createPlayedCardAnimation(currentScene, cardImg, playerId, globalPositions.current, result.success);
            
            if(result.success === false){
                return;
            }

            globalPositions.current.forEach((pos, i) => {
                updateCardCountDisplay(currentScene, pos, playerCardCounts, result.cardCount, playerId);
            })
        })

        socket.on('slapResult', ({ gameId, playerId, result }) => {
            const currentScene = game.scene.scenes[0];
            if (currentScene) {
                createSlapAnimation(currentScene, playerId, globalPositions.current);
            }
            if (result.success === true) {
                setTimeout(() => {
                    collectCardsAnimation(currentScene, playerId, globalPositions.current);
                    globalPositions.current.forEach((pos) => {
                        updateCardCountDisplay(currentScene, pos, playerCardCounts, result.count, playerId);
                    });
                }, 700);
            }else{
                if(result.message === "Invalid slap - card burned" && result.success === false){
                    // createBurnCardAnimation(currentScene, playerId, globalPositions.current);
                }
                globalPositions.current.forEach((pos) => {
                    updateCardCountDisplay(currentScene, pos, playerCardCounts, result.count, playerId);
                });
            }
        });

        socket.on('challengeWon', ({playerId, cardCount}) => {
            const currentScene = game.scene.scenes[0];
            if (currentScene) {
                collectCardsAnimation(currentScene, playerId, globalPositions.current);
                globalPositions.current.forEach((pos) => {
                    updateCardCountDisplay(currentScene, pos, playerCardCounts, cardCount, playerId);
                });
            }
        });

        // socket.on('turnStarted', ({playerId, duration}) => {
        //     const currentScene = game.scene.scenes[0];
        //     if (currentScene) {
        //         createTurnTimer(currentScene, playerId, globalPositions.current);
        //     }
        // });

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

        this.input.setDefaultCursor('url(/assets/images/cursor.png), pointer');

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
            // createPlayerLives(this, pos);
            createCardCountDisplay(this, pos, playerCardCounts);
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
    }


    function update() {
     
    }

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
