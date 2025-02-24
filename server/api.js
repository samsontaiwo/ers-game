

const apiUrl = "https://deckofcardsapi.com/static/img/"

const getCardImg = (result) => {
    if(result.success == false) return;
    let rank = result.card.rank.toUpperCase();
    let suit = result.card.suit.toUpperCase();


    return  `${rank[rank.length-1]}${suit[0]}`

}


module.exports = getCardImg;