class Coin extends CollectableObject {
  coinImg = [
    "img_pollo_locco/img/8_coin/coin_1.png",
    "img_pollo_locco/img/8_coin/coin_2.png",
  ];
  y = 330;
  height = 150;
  width = 150;
  oftset = { top: 50, left: 50, right: 50, bottom: 50 };
  collect_sound = new Audio("audio/coin-collect-sound.mp3");

  constructor(x, y) {
    super().loadImage(this.coinImg[0]);
    this.loadImages(this.coinImg);
    this.x = x;
    this.y = y;
    this.animateCoins();
  }

  animateCoins() {
    setInterval(() => this.playCoinAnimation(), 100);
  }

  playCoinAnimation() {
    this.playAnimation(this.coinImg);
  }

  collectItem(item) {
    this.markAsCollected();
    this.playCollectSound();
  }

  markAsCollected() {
    this.isCollected = true;
  }

  playCollectSound() {
    if (!isGameMuted) this.collect_sound.play();
  }
}
