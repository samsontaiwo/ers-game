
import { handleHandClick } from "./handAnimation";
import { useEffect } from "react";


// leftHandInteraction.js
let ind = 0;


export function createLeftHand(scene, pos, slotWidth, slotHeight, socket, players) {

    


    if (!scene.textures.exists('LH')) {
        console.error('LH texture not loaded yet!');
        return;
    }


    // if (scene.leftHand) {
    //     // If it exists, just return (do nothing)
    //     console.log('Left hand already exists!');
    //     return;
    // }

    // Create the left hand image at the specified position
    const leftHand = scene.add.image(pos.LHX, pos.LHY, 'LH')
        .setDisplaySize(slotWidth, slotHeight)
        .setDepth(2);

    // Make the hand interactive only if rot is 0
    if (pos.rot === 0) {
        leftHand.setInteractive()
            .on('pointerdown', () => {
                socket.emit('slap', { gameId: players[0], playerId: socket.id });
                handleHandClick(leftHand, scene, socket, players, leftHandOriginal)
            });

    }

    // Store the original position of the hand
    const leftHandOriginal = { x: leftHand.x, y: leftHand.y };

    // Set the rotation of the hand
    leftHand.rotation = Math.PI * pos.rot;

    if (!scene.leftHands) {
        scene.leftHands = {}; // Initialize the hands object if it doesn't exist
    }


    
    scene.leftHands[players[ind]] = { hand: leftHand, originalPos: leftHandOriginal };
    ind++
}
