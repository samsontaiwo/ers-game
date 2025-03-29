

// let obj = {
//     currentTurn: 0,
//     faceCardChallenge: null,
//     forcedTurn: 0,
//     hands: {},
//     pile: [], 
//     players: [ 
//         {playerId: 'Rv4SSKJ1LrcTe9vXAABH', displayName: 'gfhjgfjh', numPlayers: 2, handColor: 'red'},
//         {playerId: 'Rv4SSKJ1LrcTe9vXAABH', displayName: 'gfhjgfjh', numPlayers: 2, handColor: 'red'},
//         {playerId: 'Rv4SSKJ1LrcTe9vXAABH', displayName: 'gfhjgfjh', numPlayers: 2, handColor: 'red'},
//         {playerId: 'Rv4SSKJ1LrcTe9vXAABH', displayName: 'gfhjgfjh', numPlayers: 2, handColor: 'red'},
//     ]
// }


export function getPlayerPositions(gameInfo, playerId ) {
    let positions = [];

    const playerOrder = [...gameInfo.players];
    const currentPlayerIndex = playerOrder.findIndex(player => player.playerId === playerId);
    if (currentPlayerIndex !== -1) {
        const reorderedPlayers = [
            ...playerOrder.slice(currentPlayerIndex),
            ...playerOrder.slice(0, currentPlayerIndex)
        ];
        playerOrder.splice(0, playerOrder.length, ...reorderedPlayers);
    }
    
    
    playerOrder.forEach((player, index) => {
        let position = {
            player: player,
            x: 0,  
            y: 0,
            cardX: 0,
            cardY: 0,
            arrowX: 0,
            arrowY: 0,  
            arrowAngle: 0,
            cardWidth: 0,
            cardHeight: 0,  
        };

        switch(index) {
            case 0: // Bottom position (current player)
                position.x = 100;
                position.y = 600;
                position.cardX = 230;
                position.cardY = 600;
                position.arrowX = 230;
                position.arrowY = 500;
                position.arrowAngle = 0;
                break;
            case 1: // Top Left position
                position.x = 100;
                position.y = 100;
                position.cardX = 230;
                position.cardY = 100;
                position.arrowX = 230;
                position.arrowY = 200;
                position.arrowAngle = 180;
                break;
            case 2: // Top Right position
                position.x = 860;
                position.y = 100;
                position.cardX = 730;
                position.cardY = 100;
                break;
            case 3: // Bottom Right position
                position.x = 860;
                position.y = 600;
                position.cardX = 730;
                position.cardY = 600;
                break;
        }

        positions.push(position);
    });

    return positions;
}
