export function getPlayerPositions(totalPlayers, centerX, centerY, padding, cameraWidth, cameraHeight) {
    let positions = [];

    if (totalPlayers === 1) {
        positions = [
            { x: centerX, y: cameraHeight - padding } // Single player at the bottom
        ];
    } else if (totalPlayers === 2) {
        positions = [
            { x: centerX, y: cameraHeight - padding }, // Bottom
            { x: centerX, y: padding }  // Top
        ];
    } else if (totalPlayers === 3) {
        positions = [
            { x: centerX, y: cameraHeight - padding }, // Bottom
            { x: padding, y: centerY }, // Left
            { x: centerX, y: padding }  // Top
        ];
    } else if (totalPlayers === 4) {
        positions = [
            { x: centerX, y: cameraHeight - padding }, // Bottom
            { x: padding, y: centerY }, // Left
            { x: centerX, y: padding },  // Top
            { x: cameraWidth - padding, y: centerY }  // Right
        ];
    }

    // Ensure correct left-right positioning for 3 or 4 players
    // if (totalPlayers === 3) {
    //     positions[1].x = cameraWidth - padding;
    //     positions[1].y = centerY;
    // }
    // if (totalPlayers == 4) {
    //     positions[3].x = padding;
    //     positions[3].y = centerY;
    // }

    // Rotate the card at left (index 1) and right (index 3) positions by 90 degrees
    // This ensures only the image at these positions is rotated when the card is displayed
    

    return positions;
}
