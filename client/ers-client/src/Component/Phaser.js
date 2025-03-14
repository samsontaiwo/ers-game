import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { getPlayerPositions } from '../Function/PlayerPositions';
import { createPlayerAvatar, createPlayerNameTag, createCentralPile, createDealingAnimation, createPlayedCardAnimation, createCardCountDisplay, updateCardCountDisplay } from '../Function/GameSetup';
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
            // console.log(result.cardCount);
            const currentScene = game.scene.scenes[0];
            createPlayedCardAnimation(currentScene, cardImg, playerId, globalPositions.current, result.success);
            
            if(result.success === false){
                return;
            }

            globalPositions.current.forEach((pos, i) => {
                updateCardCountDisplay(currentScene, pos, playerCardCounts, result.cardCount, playerId);
            })
        })

        return () => {
            game.destroy(true);

        }
    }, []);




    function resizeMain() {
        const main = document.getElementById('main');
        main.style.height = '700px';
    }
   
        


    

  

    function preload() {

        this.load.image('avatar', '/assets/images/secondavatargame.png');
        this.load.image('ribbon', '/assets/images/ribbon.png');
        this.load.image('card', '/assets/images/cardback.png');
        this.load.image('slap', '/assets/images/slap.png');

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
