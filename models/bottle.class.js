/**
 * Class representing a bottle that can move and animate.
 */
class Bottle extends MovableObject {
  constructor(x, y = 380) {
    super();
    this.initConstants();
    this.initializeProperties(x, y);
    this.loadBottleImages();
    this.startAnimation();
  }

  /**
   * Initializes constants such as image paths, size, animation speed, and offset.
   */
  initConstants() {
    this.bottleImages = [
      "img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
      "img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ];
    this.defaultSize = 50;
    this.animationSpeed = 300;
    this.defaultOffset = {
      top: 16,
      left: 32,
      right: 25,
      bottom: 8,
    };
  }

  /**
   * Sets the properties of the bottle such as position, size, and status.
   */
  initializeProperties(x, y) {
    this.x = x;
    this.y = y;
    this.height = this.defaultSize;
    this.width = this.defaultSize;
    this.isCollected = false;
    this.offset = { ...this.defaultOffset };
    this.animationInterval = null;
  }

  /**
   * Loads the bottle images.
   */
  loadBottleImages() {
    this.loadImage(this.bottleImages[0]);
    this.loadImages(this.bottleImages);
  }

  /**
   * Starts the bottle animation loop.
   */
  startAnimation() {
    this.stopAnimation();
    this.setupAnimationInterval();
  }

  /**
   * Sets up the interval for repeating the animation.
   */
  setupAnimationInterval() {
    this.animationInterval = setInterval(() => {
      if (!this.isCollected) {
        this.playAnimation(this.bottleImages);
      }
    }, this.animationSpeed);
  }

  /**
   * Stops the animation loop if it is running.
   */
  stopAnimation() {
    if (this.animationInterval) {
      this.clearAnimationInterval();
    }
  }

  /**
   * Clears the animation interval.
   */
  clearAnimationInterval() {
    clearInterval(this.animationInterval);
    this.animationInterval = null;
  }

  /**
   * Marks the bottle as collected and stops the animation.
   */
  collect() {
    this.isCollected = true;
    this.stopAnimation();
  }

  /**
   * Cleans up the bottle on destruction (stops animation).
   */
  destroy() {
    this.stopAnimation();
  }
}
