class Coin extends CollectableObject {
  coinImg = [
    "img_pollo_locco/img/8_coin/coin_1.png",
    "img_pollo_locco/img/8_coin/coin_2.png",
  ];
  y = 330;
  height = 150;
  width = 150;
  oftset = { top: 50, left: 50, right: 50, bottom: 50 };
  animationInterval;

  constructor(x, y) {
    super().loadImage(this.coinImg[0]);
    this.loadImages(this.coinImg);
    this.x = x;
    this.y = y;
    this.animateCoins();
  }

  animateCoins() {
    this.lastTime = 0;
    this.animationInterval = requestAnimationFrame(this.animateFrame.bind(this));
  }

  animateFrame(currentTime) {
    if (this.shouldAnimate(currentTime)) {
      this.playCoinAnimation();
      this.lastTime = currentTime;
    }
    if (!this.isCollected) {
      this.animationInterval = requestAnimationFrame(this.animateFrame.bind(this));
    }
  }

  shouldAnimate(currentTime) {
    return currentTime - this.lastTime >= 200;
  }

  playCoinAnimation() {
    this.playAnimation(this.coinImg);
  }

  stopAnimation() {
    if (this.animationInterval) {
      cancelAnimationFrame(this.animationInterval);
      this.animationInterval = null;
    }
  }

  collect() {
    this.isCollected = true;
    this.stopAnimation();
  }
}
