/**
 * Class representing a collectible coin.
 */
class Coin extends CollectableObject {
  coinImg = [
    "img_pollo_locco/img/8_coin/coin_1.png",
    "img_pollo_locco/img/8_coin/coin_2.png",
  ];
  y = 330;
  height = 150;
  width = 150;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Creates a coin at specified position.
   * @param {number} x - Horizontal position
   * @param {number} y - Vertical position
   */
  constructor(x, y) {
    super().loadImage(this.coinImg[0]);
    this.loadImages(this.coinImg);
    this.x = x;
    this.y = y;
    this.animateCoins();
  }

  /**
   * Starts coin animation using requestAnimationFrame.
   */
  animateCoins() {
    this.lastTime = 0;
    this.animationInterval = requestAnimationFrame(this.animateFrame.bind(this));
  }

  /**
   * Handles animation frame updates.
   * @param {DOMHighResTimeStamp} currentTime - Current time
   */
  animateFrame(currentTime) {
    if (this.shouldAnimate(currentTime)) {
      this.playCoinAnimation();
      this.lastTime = currentTime;
    }
    if (!this.isCollected) {
      this.animationInterval = requestAnimationFrame(this.animateFrame.bind(this));
    }
  }

  /**
   * Checks if animation frame should update.
   * @param {DOMHighResTimeStamp} currentTime - Current time
   * @returns {boolean} True if should animate
   */
  shouldAnimate(currentTime) {
    return currentTime - this.lastTime >= 200;
  }

  /**
   * Plays coin animation by cycling images.
   */
  playCoinAnimation() {
    this.playAnimation(this.coinImg);
  }

  /**
   * Stops coin animation.
   */
  stopAnimation() {
    if (this.animationInterval) {
      cancelAnimationFrame(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Marks coin as collected and stops animation.
   */
  collect() {
    this.isCollected = true;
    this.stopAnimation();
  }
}