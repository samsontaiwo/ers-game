import { getPlayerOrder } from "./PlayerOrder";
import { getPlayerPositions } from "./PlayerPositions";

export function assignSpot(players, socketId, cameraWidth, cameraHeight) {
    //it's going to take playerOrder, playerPositions, 
    let track = {};

    const padding = 145; 
    const centerX = cameraWidth / 2; // 500
    const centerY = cameraHeight / 2; // 400


    const positions = getPlayerPositions(players, centerX, centerY, padding, cameraWidth, cameraHeight);

    let order = getPlayerOrder(players, socketId);

    for(let i=0; i < order.length; i++ ){
        track[order[i]] = positions[i]
    }

    return track;
    
}