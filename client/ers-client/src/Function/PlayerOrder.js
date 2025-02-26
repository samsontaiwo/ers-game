// PlayerOrder.js
export function getPlayerOrder(players, socketId) {
    let playerOrder = [];
    const playerIndex = players.indexOf(socketId);

    if (playerIndex !== 0) {
        playerOrder = [...players.slice(playerIndex), ...players.slice(0, playerIndex)];
    } else {
        playerOrder = players;
    }

    return playerOrder;
}
