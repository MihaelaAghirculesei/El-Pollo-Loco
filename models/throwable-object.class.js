/**
 * Throwable object class for bottles.
 */
class ThrowableObject extends MovableObject {
  static IMAGES_ROTATION = [
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
  ];

  static IMAGES_SPLASH = [
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  /**
   * Creates throwable object instance.
   * @param {number} x - Initial X coordinate
   * @param {number} y - Initial Y coordinate
   * @param {number} direction - Throw direction (1 for right, -1 for left)
   */
  constructor(x, y, direction = 1) {
    super();
    this.initializeProperties(x, y, direction);
    this.loadImages(ThrowableObject.IMAGES_ROTATION);
    this.loadImages(ThrowableObject.IMAGES_SPLASH);
    this.setInitialImage();
    this.startThrow();
    this.startRotationAnimation();
  }

  /**
   * Initializes throwable object properties.
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} direction - Throw direction
   */
  initializeProperties(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.splashed = false;
    this.hasHit = false;
    this.direction = direction;
  }

  /**
   * Sets initial image for throwable object.
   */
  setInitialImage() {
    this.img = this.imageCache[ThrowableObject.IMAGES_ROTATION[0]];
  }

  /**
   * Initiates throwing action.
   */
  startThrow() {
    this.speedY = 30;
    this.applyGravity();
    this.startMoving();
  }

  /**
   * Starts horizontal movement.
   */
  startMoving() {
    let speed = this.getThrowSpeed();
    this.movementInterval = setInterval(
      () => (this.x += speed * this.direction),
      30
    );
  }

  /**
   * Gets throw speed based on direction.
   * @returns {number} Throw speed
   */
  getThrowSpeed() {
    return this.direction === -1 ? 5 : 10;
  }

  /**
   * Starts rotation animation.
   */
  startRotationAnimation() {
    this.rotationInterval = setInterval(() => {
      if (!this.splashed) this.playRotationAnimation();
    }, 100);
  }

  /**
   * Plays rotation animation.
   */
  playRotationAnimation() {
    this.playAnimation(ThrowableObject.IMAGES_ROTATION);
  }

  /**
   * Handles splash event.
   */
  splash() {
    this.splashed = true;
    this.hasHit = true;
    this.stopMoving();
    this.stopRotationAnimation();
    this.y -= 30;
    this.playSplashAnimation().then(() => this.removeFromWorld());
  }

  /**
   * Stops horizontal movement.
   */
  stopMoving() {
    clearInterval(this.movementInterval);
  }

  /**
   * Stops rotation animation.
   */
  stopRotationAnimation() {
    clearInterval(this.rotationInterval);
  }

  /**
   * Plays splash animation once.
   * @returns {Promise<void>} Promise that resolves when animation completes
   */
  playSplashAnimation() {
    return this.playAnimationOnce(ThrowableObject.IMAGES_SPLASH);
  }

  /**
   * Plays animation sequence once.
   * @param {string[]} images - Animation images
   * @returns {Promise<void>} Promise that resolves when complete
   */
  playAnimationOnce(images) {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < images.length) {
          this.img = this.imageCache[images[i++]];
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Removes throwable object from world.
   */
  removeFromWorld() {
    if (this.world) {
      const index = this.world.level.enemies.indexOf(this);
      if (index > -1) this.world.level.enemies.splice(index, 1);
    }
  }
}