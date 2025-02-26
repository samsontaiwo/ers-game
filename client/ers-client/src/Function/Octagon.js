// Octagon.js
export default class Octagon {
    constructor(scene) {
        this.scene = scene;
    }

    create() {
        const boardWidth = 1200;
        const boardHeight = 900;
        const boardGraphics = this.scene.add.graphics();

        // Define the center and size of the octagon
        const boardCenterX = boardWidth / 2;
        const boardCenterY = boardHeight / 2;
        const boardSizeX = boardWidth / 2;  // Half-width to fit horizontally
        const boardSizeY = boardHeight / 2; // Half-height to fit vertically

        // Calculate the octagon's vertices to fill the scene
        const octagonVertices = [
            { x: boardCenterX - boardSizeX * 0.707, y: 0 }, // Top left
            { x: boardCenterX + boardSizeX * 0.707, y: 0 }, // Top right
            { x: boardWidth, y: boardCenterY - boardSizeY * 0.707 }, // Right top
            { x: boardWidth, y: boardCenterY + boardSizeY * 0.707 }, // Right bottom
            { x: boardCenterX + boardSizeX * 0.707, y: boardHeight }, // Bottom right
            { x: boardCenterX - boardSizeX * 0.707, y: boardHeight }, // Bottom left
            { x: 0, y: boardCenterY + boardSizeY * 0.707 }, // Left bottom
            { x: 0, y: boardCenterY - boardSizeY * 0.707 }  // Left top
        ];

        // Add a border
        boardGraphics.lineStyle(4, 0xffffff, 1);
        boardGraphics.strokePath();

        // Draw the octagonal board
        boardGraphics.fillStyle(0x004d00, 1); // Dark green fill
        boardGraphics.beginPath();
        boardGraphics.moveTo(octagonVertices[0].x, octagonVertices[0].y);
        octagonVertices.forEach(point => boardGraphics.lineTo(point.x, point.y));
        boardGraphics.closePath();
        boardGraphics.fillPath();

        // Add a border
        boardGraphics.lineStyle(4, 0xffffff, 1);
        boardGraphics.strokePath();
    }
}
