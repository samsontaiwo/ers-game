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
    hands[player.playerId] = deck.filter((_, index) => index % playerCount === i);
  });
  // console.log(hands);

  return hands;
}

const punishment = { J: 1, Q: 2, K: 3, A: 4 };

class ERSGame {
  constructor(players) {
    this.players = players; // Array of player objects
    this.hands = {};
    this.pile = [];
    this.currentTurn = 0;
    this.forcedTurn = 0;
    this.faceCardChallenge = null;
    this.timer = 3000; // 3 seconds in milliseconds
    this.turnStartTime = null;
    // this.challengeWinner = null;
    this.isWaitingForSlap = false;
    this.isLocked = false;
  }

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  addPlayer(playerInfo) {
    this.players.push(playerInfo); // playerInfo is an object with player details
  }

  assignCards() {
    this.hands = dealCards(this.players);
    return this.hands;
  }

  startTurn() {
    this.turnStartTime = Date.now();
    return {
      playerId: this.getCurrentPlayer().playerId,
      duration: this.timer
    };
  }

  checkTurnTimeout() {
    if (!this.turnStartTime) return false;
    
    const elapsed = Date.now() - this.turnStartTime;
    if (elapsed >= this.timer) {
      // Auto play card if time is up
      const currentPlayer = this.getCurrentPlayer();
      if (this.hands[currentPlayer.playerId].length > 0) {
        return this.playCard(currentPlayer.playerId);
      }
    }
    return false;
  }

  playCard(playerId) {
    if (this.isLocked) {
      return { success: false, message: "Game is locked" };
    }

    // Reset turn timer
    this.turnStartTime = null;

    if (playerId !== this.getCurrentPlayer().playerId) {
      return { success: false };
    }

    let card = this.hands[playerId].shift();
    this.pile.push(card);

    // Reset challenge if 10 is played
    if (card.rank === "10") {
      this.faceCardChallenge = null;
      this.forcedTurn = 0;
      this.nextTurn();
      return { success: true, card, cardCount: this.hands[playerId].length };
    }

    if (["J", "Q", "K", "A"].includes(card.rank)) {
      this.faceCardChallenge = { rank: card.rank, challenger: playerId };
      this.forcedTurn = punishment[card.rank];
      this.nextTurn();
      return { success: true, card, cardCount: this.hands[playerId].length };
    }

    if (this.forcedTurn > 0) {
      this.forcedTurn--;

      if (this.forcedTurn === 0) {
        this.nextTurn();
      }

      if (this.forcedTurn === 0 && this.faceCardChallenge) {
        let winner = this.faceCardChallenge.challenger;
        this.isWaitingForSlap = true;
        this.isLocked = true;
        
        setTimeout(() => {
          this.isLocked = false;
        }, 2000);

        return { 
          success: true, 
          card, 
          cardCount: this.hands[playerId].length,
          challengeComplete: true,
          challengeWinner: winner,
          challengeWinnerCardCount: this.hands[winner].length
        };
      }
      console.log('counting......');
      return { success: true, card, cardCount: this.hands[playerId].length };
    }

    this.nextTurn();
    return { success: true, card, cardCount: this.hands[playerId].length };
  }

  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  }

  slap(playerId) {
    if (isValidSlap(this.pile)) {
      this.isLocked = true;
      
      setTimeout(() => {
        this.isLocked = false;
      }, 2000);

      console.log('yep you can slap this');
      this.isWaitingForSlap = false;
      this.faceCardChallenge = null;
      this.forcedTurn = 0;
      
      this.hands[playerId] = [...this.hands[playerId], ...this.pile];
      this.pile = [];
      this.currentTurn = this.players.findIndex(player => player.playerId === playerId);
      
      return { success: true, message: `${playerId} won the pile!`, count: this.hands[playerId].length };
    }
    console.log('what are u doing NOOOO');
    return { success: false, message: "Invalid slap!" };
  }

  checkWin() {
    let winner = this.players.find(player => this.hands[player.playerId].length === 52);
    return winner ? { winner } : null;
  }
}

const isValidSlap = (pile) => {
  if (pile.length === 0) {
    return false;
  }

  let top = pile[pile.length - 1];
  let second = null;

  if(pile.length > 1){
    second = pile[pile.length - 2];
  }

  // Double
  if(top && second){
    if (top.rank === second.rank) return true;
  }

  // Sandwich
  if (pile.length > 2) {
    let third = pile[pile.length - 3];
    if (top.rank === third.rank) return true;
  }

  // Seven
  if (top.rank === "7") return true;
  return false;
}

module.exports = ERSGame;
