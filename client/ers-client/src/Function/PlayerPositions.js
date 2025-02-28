export function getPlayerPositions(playerOrder, centerX, centerY, padding, cameraWidth, cameraHeight, ) {
    let positions = [];
    const totalPlayers = playerOrder.length;

    if (totalPlayers === 1) {
        positions = [
            { x: centerX, y: cameraHeight - padding, LHX: 450, LHY: 765, rot: 0,  } // Single player at the bottom
        ];
    } else if (totalPlayers === 2) {
        positions = [
            { x: centerX, y: cameraHeight - padding, LHX: 450, LHY: 765, rot: 0,  }, // Bottom
            { x: centerX, y: padding, LHX: 750, LHY: 135, rot: 1, }  // Top
        ];
    } else if (totalPlayers === 3) {
        positions = [
            { x: centerX, y: cameraHeight - padding, LHX: 450, LHY: 765, rot: 0 }, // Bottom
            { x: padding, y: centerY, LHX: 140, LHY: 315, rot: 0.5,  }, // Left
            { x: centerX, y: padding, LHX: 750, LHY: 135, rot: 1,  }  // Top
        ];
    } else if (totalPlayers === 4) {
        positions = [
            { x: centerX, y: cameraHeight - padding, LHX: 450, LHY: 765, rot: 0 }, // Bottom
            { x: padding, y: centerY, LHX: 140, LHY: 315, rot: 0.5,}, // Left
            { x: centerX, y: padding, LHX: 750, LHY: 135, rot: 1, },  // Top
            { x: cameraWidth - padding, y: centerY, LHX: 1060, LHY: 585, rot: -0.5 }  // Right
        ];
    }

    positions.forEach((pos, ind) => {
        pos.name = playerOrder[ind]
    })

    return positions;
}
