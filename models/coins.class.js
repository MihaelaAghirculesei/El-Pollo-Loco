class Coin extends CollectableObject {
  /**
   * Array of coin image paths for animation frames.
   */
  coinImg = [
    "img_pollo_locco/img/8_coin/coin_1.png",
    "img_pollo_locco/img/8_coin/coin_2.png",
  ];

  /**
   * Vertical position of the coin.
   */
  y = 330;

  /**
   * Height of the coin object.
   */
  height = 150;

  /**
   * Width of the coin object.
   */
  width = 150;

  /**
   * Offset for collision detection or positioning.
   */
   offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Reference to the animation frame request ID.
   */
  animationInterval;

  /**
   * Constructor initializes the coin position and starts animation.
   * @param {number} x - The horizontal position of the coin.
   * @param {number} y - The vertical position of the coin.
   */
  constructor(x, y) {
    super().loadImage(this.coinImg[0]);
    this.loadImages(this.coinImg);
    this.x = x;
    this.y = y;
    this.animateCoins();
  }

  /**
   * Starts the coin animation using requestAnimationFrame.
   */
  animateCoins() {
    this.lastTime = 0;
    this.animationInterval = requestAnimationFrame(this.animateFrame.bind(this));
  }

  /**
   * Handles animation frame updates.
   * @param {DOMHighResTimeStamp} currentTime - The current time from requestAnimationFrame.
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
   * Checks if enough time has passed to update the animation frame.
   * @param {DOMHighResTimeStamp} currentTime - The current time from requestAnimationFrame.
   * @returns {boolean} True if animation frame should update.
   */
  shouldAnimate(currentTime) {
    return currentTime - this.lastTime >= 200;
  }

  /**
   * Plays the coin animation by cycling through images.
   */
  playCoinAnimation() {
    this.playAnimation(this.coinImg);
  }

  /**
   * Stops the coin animation.
   */
  stopAnimation() {
    if (this.animationInterval) {
      cancelAnimationFrame(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Marks the coin as collected and stops animation.
   */
  collect() {
    this.isCollected = true;
    this.stopAnimation();
  }
}
