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
    this.isWaitingForSlap = false;
    this.isLocked = false;
    this.eliminatedPlayers = [];
    this.initalLives = 2;
    this.autoShuffle = false;
    this.timer = 30000; // Add a default timer (30 seconds for each turn)
  }

  settings({lives, autoShuffle}) {
    this.initalLives = lives;
    this.autoShuffle = autoShuffle;
    
    this.players.forEach(player => {
      player.lives = lives;
    })
    return {lives, autoShuffle};
  }

  getCurrentPlayer() {
    return this.players[this.currentTurn]; //currently using index to track (that's why)
  }

  addPlayer(playerInfo) {
    this.players.push(playerInfo); // playerInfo is an object with player details
  }

  assignCards() {
    this.hands = dealCards(this.players);
    return this.hands;
  }

  playCard(playerId) {
    if (this.isLocked) {
      return { success: false, message: "Game is locked" };
    }

    if (playerId !== this.getCurrentPlayer().playerId) {  //debug this.currentTurn!
      return { success: false };
    }

    // Skip players with no cards automatically
    if (this.hands[playerId].length === 0) {
      if (!this.eliminatedPlayers.includes(playerId)) {
        this.eliminatedPlayers.push(playerId);
      }
      this.nextTurn();
      // Recursively call playCard for the next player if they also have no cards
      if (this.getCurrentPlayer() && this.hands[this.getCurrentPlayer().playerId].length === 0) {
        return this.playCard(this.getCurrentPlayer().playerId);
      }
      return { success: false, message: "No cards left", autoSkipped: true };
    }

    let card = this.hands[playerId].shift();
    this.pile.push(card);

    if (this.hands[playerId].length === 0 && !this.eliminatedPlayers.includes(playerId)) {
      this.eliminatedPlayers.push(playerId);
    }

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
      return { success: true, card, cardCount: this.hands[playerId].length };
    }

    this.nextTurn();
    return { success: true, card, cardCount: this.hands[playerId].length };
  }

  nextTurn() {
    do {
      this.currentTurn = (this.currentTurn + 1) % this.players.length;
    } while (
      this.eliminatedPlayers.includes(this.players[this.currentTurn].playerId) && 
      this.eliminatedPlayers.length < this.players.length
    );
    // console.log(this.players[this.currentTurn])
    
  }

  getNextTurn() {
    return this.players[this.currentTurn];
  }

  getActivePlayers() {
    return this.players.filter(player => !this.eliminatedPlayers.includes(player.playerId));
  }

  slap(playerId) {
    this.isLocked = true;
    setTimeout(() => {
      this.isLocked = false;
    }, 1000);

    // Find the player object
    const player = this.players.find(p => p.playerId === playerId);

    if(player.lives === 0) return {success: false, message: "You have 0 lives left!"};

    if (isValidSlap(this.pile)) {
      console.log('yep you can slap this');
      this.isWaitingForSlap = false;
      this.faceCardChallenge = null;
      this.forcedTurn = 0;
      
      // Give cards to player
      this.hands[playerId] = [...this.hands[playerId], ...this.pile];
      this.pile = [];
      
      // If player was eliminated, bring them back in
      if (this.eliminatedPlayers.includes(playerId)) {
        this.eliminatedPlayers = this.eliminatedPlayers.filter(id => id !== playerId);
      }

      this.currentTurn = this.players.findIndex(p => p.playerId === playerId);
      
      return { success: true, message: `${playerId} won the pile!`, count: this.hands[playerId].length };
    } else {
      if(this.eliminatedPlayers.includes(playerId) && player.lives > 0){
        player.lives--;
        return { success: false, message: "Invalid slap - no cards to burn", lives: player.lives };
      }else if(this.eliminatedPlayers.includes(playerId) && player.lives === 0){
        this.eliminatedPlayers.push(playerId);
        return { success: false, message: "Invalid slap - no cards to burn", lives: player.lives };
      }
      if (this.hands[playerId].length > 0) {
        const burnCard = this.hands[playerId].shift(); // Remove top card
        this.pile.unshift(burnCard); // Add to bottom of pile

        // Check if player should be eliminated after burning card
        if (this.hands[playerId].length === 0 && !this.eliminatedPlayers.includes(playerId)) {
          this.eliminatedPlayers.push(playerId);
        }

        return { success: false, message: "Invalid slap - card burned", count: this.hands[playerId].length };
      }
      return { success: false, message: "Invalid slap - no cards to burn" };
    }
  }

  checkWin() {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 1) {
      return {
        winner: activePlayers[0],
        message: "Last player with cards wins!"
      };
    }
    return null;
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
