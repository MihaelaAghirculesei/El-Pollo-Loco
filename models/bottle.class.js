/**
 * Class representing a bottle that can move and animate.
 */
class Bottle extends MovableObject {
  bottleImages = [
    "img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  defaultSize = 50;
  animationSpeed = 300;
  defaultOffset = {top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Creates a new bottle instance.
   * @param {number} x - Horizontal position
   * @param {number} y - Vertical position (default: 380)
   */
  constructor(x, y = 380) {
    super();
    this.initializeProperties(x, y);
    this.loadBottleImages();
    this.startAnimation();
  }

  /**
   * Sets the properties of the bottle.
   * @param {number} x - Horizontal position
   * @param {number} y - Vertical position
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
   * Loads the bottle images into cache.
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
    this.animationInterval = setInterval(() => {
      if (!this.isCollected) {
        this.playAnimation(this.bottleImages);
      }
    }, this.animationSpeed);
  }

  /**
   * Stops the animation loop if running.
   */
  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Marks the bottle as collected and stops animation.
   */
  collect() {
    this.isCollected = true;
    this.stopAnimation();
  }

  /**
   * Cleans up the bottle on destruction.
   */
  destroy() {
    this.stopAnimation();
  }
}