const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", 
  "J", "Q", "K", "A"
];

const createDeck = () => {
    let deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ rank, suit });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
}

const dealCards = (players) => {
    let deck = createDeck();
    let hands = {};
    let playerCount = players.length;

    players.forEach((player, i) => {
        hands[player] = deck.filter((_, index) => index % playerCount === i);
    });

  return hands;
}

class ERSGame {
    constructor(players) {
        this.players = players; //array of player IDs
        this.hands = dealCards(players);
        this.pile = [];
        this.currentTurn = 0;
        this.faceCardChallenge = null;
    }

    /**
   * Gets the current player’s ID.
   */
    getCurrentPlayer(){
        return this.players[this.currentTurn];
    }

    /**
   * Handles a player playing a card.
   * @param {string} playerId - The player playing the card.
   */

    playCard(playerId) {
        if (playerId !== this.getCurrentPlayer()){
            return { error: "Not your turn!" }
        }

        let card = this.hands[playerId].shift(); // Remove top card
        this.pile.push(card); // Add to pile

        if (["J", "Q", "K", "A"].includes(card.rank)) {
            this.faceCardChallenge = { rank: card.rank, challenger: playerId };
          } else {
            this.nextTurn();
          }
      
          return { success: true, card };
        }

        nextTurn() {
            this.currentTurn = (this.currentTurn + 1) % this.players.length;
        }
    }


const isValidSlap = (pile) => {
    if(pile.length < 2) {
        return false;
    }

    let top = pile[pile.length - 1];
    let second = pile[pile.length - 2];

    // Double
    if (top.rank === second.rank) return true;

    // Sandwich
    if (pile.length > 2) {
        let third = pile[pile.length - 3];
        if (top.rank === third.rank) return true;
    }
}

ERSGame.prototype.slap = function (playerId) {
    if (isValidSlap(this.pile)) {
      this.hands[playerId] = [...this.hands[playerId], ...this.pile];
      this.pile = [];
      return { success: true, message: `${playerId} won the pile!` };
    }
    return { success: false, message: "Invalid slap!" };
  };

  ERSGame.prototype.checkWin = function () {
    let winner = this.players.find(player => this.hands[player].length === 52);
    return winner ? { winner } : null;
  };
















}