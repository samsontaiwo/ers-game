// AssetLoader.js
export default class AssetLoader {
    constructor(scene) {
        this.scene = scene;
    }

    preload() {


        this.scene.load.image('avatar', '/assets/images/secondavatargame.png');
        this.scene.load.image('ribbon', '/assets/images/ribbon.png');
        this.scene.load.image('card', '/assets/images/cardback.png');
        this.scene.load.image('slap', '/assets/images/slap.png');
        this.scene.load.image('heart', '/assets/images/heart.png');
        this.scene.load.image('hand', '/assets/images/hand.png');
        this.scene.load.image('triangle', '/assets/images/triangle.png')

        // Load all the card images (52 cards + 2 jokers)
        this.scene.load.image('AS', 'https://deckofcardsapi.com/static/img/AS.png');
        this.scene.load.image('2S', 'https://deckofcardsapi.com/static/img/2S.png');
        this.scene.load.image('3S', 'https://deckofcardsapi.com/static/img/3S.png');
        this.scene.load.image('4S', 'https://deckofcardsapi.com/static/img/4S.png');
        this.scene.load.image('5S', 'https://deckofcardsapi.com/static/img/5S.png');
        this.scene.load.image('6S', 'https://deckofcardsapi.com/static/img/6S.png');
        this.scene.load.image('7S', 'https://deckofcardsapi.com/static/img/7S.png');
        this.scene.load.image('8S', 'https://deckofcardsapi.com/static/img/8S.png');
        this.scene.load.image('9S', 'https://deckofcardsapi.com/static/img/9S.png');
        this.scene.load.image('0S', 'https://deckofcardsapi.com/static/img/0S.png');
        this.scene.load.image('JS', 'https://deckofcardsapi.com/static/img/JS.png');
        this.scene.load.image('QS', 'https://deckofcardsapi.com/static/img/QS.png');
        this.scene.load.image('KS', 'https://deckofcardsapi.com/static/img/KS.png');
    
        this.scene.load.image('AH', 'https://deckofcardsapi.com/static/img/AH.png');
        this.scene.load.image('2H', 'https://deckofcardsapi.com/static/img/2H.png');
        this.scene.load.image('3H', 'https://deckofcardsapi.com/static/img/3H.png');
        this.scene.load.image('4H', 'https://deckofcardsapi.com/static/img/4H.png');
        this.scene.load.image('5H', 'https://deckofcardsapi.com/static/img/5H.png');
        this.scene.load.image('6H', 'https://deckofcardsapi.com/static/img/6H.png');
        this.scene.load.image('7H', 'https://deckofcardsapi.com/static/img/7H.png');
        this.scene.load.image('8H', 'https://deckofcardsapi.com/static/img/8H.png');
        this.scene.load.image('9H', 'https://deckofcardsapi.com/static/img/9H.png');
        this.scene.load.image('0H', 'https://deckofcardsapi.com/static/img/0H.png');
        this.scene.load.image('JH', 'https://deckofcardsapi.com/static/img/JH.png');
        this.scene.load.image('QH', 'https://deckofcardsapi.com/static/img/QH.png');
        this.scene.load.image('KH', 'https://deckofcardsapi.com/static/img/KH.png');
    
        this.scene.load.image('AD', 'https://deckofcardsapi.com/static/img/AD.png');
        this.scene.load.image('2D', 'https://deckofcardsapi.com/static/img/2D.png');
        this.scene.load.image('3D', 'https://deckofcardsapi.com/static/img/3D.png');
        this.scene.load.image('4D', 'https://deckofcardsapi.com/static/img/4D.png');
        this.scene.load.image('5D', 'https://deckofcardsapi.com/static/img/5D.png');
        this.scene.load.image('6D', 'https://deckofcardsapi.com/static/img/6D.png');
        this.scene.load.image('7D', 'https://deckofcardsapi.com/static/img/7D.png');
        this.scene.load.image('8D', 'https://deckofcardsapi.com/static/img/8D.png');
        this.scene.load.image('9D', 'https://deckofcardsapi.com/static/img/9D.png');
        this.scene.load.image('0D', 'https://deckofcardsapi.com/static/img/0D.png');
        this.scene.load.image('JD', 'https://deckofcardsapi.com/static/img/JD.png');
        this.scene.load.image('QD', 'https://deckofcardsapi.com/static/img/QD.png');
        this.scene.load.image('KD', 'https://deckofcardsapi.com/static/img/KD.png');
    
        this.scene.load.image('AC', 'https://deckofcardsapi.com/static/img/AC.png');
        this.scene.load.image('2C', 'https://deckofcardsapi.com/static/img/2C.png');
        this.scene.load.image('3C', 'https://deckofcardsapi.com/static/img/3C.png');
        this.scene.load.image('4C', 'https://deckofcardsapi.com/static/img/4C.png');
        this.scene.load.image('5C', 'https://deckofcardsapi.com/static/img/5C.png');
        this.scene.load.image('6C', 'https://deckofcardsapi.com/static/img/6C.png');
        this.scene.load.image('7C', 'https://deckofcardsapi.com/static/img/7C.png');
        this.scene.load.image('8C', 'https://deckofcardsapi.com/static/img/8C.png');
        this.scene.load.image('9C', 'https://deckofcardsapi.com/static/img/9C.png');
        this.scene.load.image('0C', 'https://deckofcardsapi.com/static/img/0C.png');
        this.scene.load.image('JC', 'https://deckofcardsapi.com/static/img/JC.png');
        this.scene.load.image('QC', 'https://deckofcardsapi.com/static/img/QC.png');
        this.scene.load.image('KC', 'https://deckofcardsapi.com/static/img/KC.png');
    }
}
