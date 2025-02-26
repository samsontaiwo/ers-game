// PlayerPositions.js
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
            { x: cameraWidth - padding, y: centerY }  // Right (50px from the right)
        ];
    }

    return positions;
}
