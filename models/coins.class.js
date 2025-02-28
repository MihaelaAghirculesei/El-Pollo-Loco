class Coin extends MovableObject {
    coinImg = ['img_pollo_locco/img/8_coin/coin_1.png','img_pollo_locco/img/8_coin/coin_2.png'];
    y = 330;
    height = 150;
    width = 150;

    oftset = {
        top: 50,
        left: 50,
        right: 50,
        bottom:50
    }

    constructor (x, y) {
        super().loadImage('img_pollo_locco/img/8_coin/coin_1.png');
        this.loadImages(this.coinImg);
        this.x = x;
        this.y = y;
        this.animateCoins();
    }
    
    animateCoins() {
        setInterval(() => {
          this.playAnimation(this.coinImg);
        }, 100);
      }
}