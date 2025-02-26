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

const punishment = {J: 1, Q: 2, K: 3, A: 4};

class ERSGame {
    constructor(players) {
        this.players = players; //array of player IDs
        this.hands = {};
        this.pile = [];
        this.currentTurn = 0;
        this.forcedTurn = 0;
        this.faceCardChallenge = null;
    }


    getCurrentPlayer(){
        return this.players[this.currentTurn];
    }

  

    addPlayer(playerId){{
        this.players.push(playerId);

    }}

    assignCards() {
      this.hands = dealCards(this.players)
    }


    playCard(playerId) {
        if (playerId !== this.getCurrentPlayer()){
            return {  success : false }
        }

        let card = this.hands[playerId].shift(); // Remove top card
        this.pile.push(card); // Add to pile

        // Reset challenge if 10 is played
        if (card.rank === "10") {
          this.faceCardChallenge = null;
          this.forcedTurn = 0;
          this.nextTurn();
          return { success: true, card };
        }

        if (["J", "Q", "K", "A"].includes(card.rank)) {
          this.faceCardChallenge = { rank: card.rank, challenger: playerId };
          this.forcedTurn = punishment[card.rank];
          this.nextTurn();
          return { success: true, card };
        }

        if(this.forcedTurn > 0){
          this.forcedTurn--;

          if(this.forcedTurn === 0){
            this.nextTurn();
          }

          if(this.forcedTurn === 0 && this.faceCardChallenge){
            let winner = this.faceCardChallenge.challenger;
            this.hands[winner] = [...this.hands[winner], ...this.pile];
            this.pile = [];
            this.faceCardChallenge = null; // Reset challenge

            this.currentTurn = this.players.indexOf(winner);
          }

          return { success: true, card };
        }

        this.nextTurn();
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
    console.log(top.rank);

    // Double
    if (top.rank === second.rank) return true;

    // Sandwich
    if (pile.length > 2) {
        let third = pile[pile.length - 3];
        if (top.rank === third.rank) return true;
    }

    // Seven
    if(top.rank == "7") return true;
    return false;
}

ERSGame.prototype.slap = function (playerId) {
    if (isValidSlap(this.pile)) {
      console.log('yep you can slap this')
      this.hands[playerId] = [...this.hands[playerId], ...this.pile];
      this.pile = [];
      this.currentTurn = this.players.indexOf(playerId);
      return { success: true, message: `${playerId} won the pile!` };
    }
    console.log('what are u doing NOOOO')
    return { success: false, message: "Invalid slap!" };
  };

ERSGame.prototype.checkWin = function () {
  let winner = this.players.find(player => this.hands[player].length === 52);
  return winner ? { winner } : null;
};

module.exports = ERSGame;















