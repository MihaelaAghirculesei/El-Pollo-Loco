/**
 * Represents a throwable object in the game, extending MovableObject.
 * This class handles the logic for throwing, rotating, and splashing a throwable item.
 */
class ThrowableObject extends MovableObject {
  /**
   * Static array of image paths for the rotation animation of the throwable object.
   * @type {string[]}
   */
  static IMAGES_ROTATION = [
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
  ];

  /**
   * Static array of image paths for the splash animation of the throwable object.
   * @type {string[]}
   */
  static IMAGES_SPLASH = [
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  /**
   * Creates an instance of ThrowableObject.
   * @param {number} x - The initial x-coordinate of the object.
   * @param {number} y - The initial y-coordinate of the object.
   * @param {number} [direction=1] - The direction of the throw (1 for right, -1 for left).
   */
  constructor(x, y, direction = 1) {
    super();
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.splashed = false;
    this.hasHit = false;
    this.direction = direction;
    this.loadImages(ThrowableObject.IMAGES_ROTATION);
    this.loadImages(ThrowableObject.IMAGES_SPLASH);
    this.setInitialImage();
    this.startThrow();
    this.startRotationAnimation();
  }

  /**
   * Sets the initial image of the throwable object.
   */
  setInitialImage() {
    this.img = this.imageCache[ThrowableObject.IMAGES_ROTATION[0]];
  }

  /**
   * Initiates the throwing action, applying gravity and starting horizontal movement.
   */
  startThrow() {
    this.speedY = 30;
    this.applyGravity();
    this.startMoving();
  }

  /**
   * Starts the horizontal movement of the throwable object.
   */
  startMoving() {
    let speed = this.getThrowSpeed();
    this.movementInterval = setInterval(
      () => (this.x += speed * this.direction),
      30
    );
  }

  /**
   * Determines the horizontal speed of the throw based on the direction.
   * @returns {number} The throwing speed.
   */
  getThrowSpeed() {
    return this.direction === -1 ? 5 : 10;
  }

  /**
   * Starts the rotation animation of the throwable object.
   */
  startRotationAnimation() {
    this.rotationInterval = setInterval(() => {
      if (!this.splashed) this.playRotationAnimation();
    }, 100);
  }

  /**
   * Plays the rotation animation using the predefined rotation images.
   */
  playRotationAnimation() {
    this.playAnimation(ThrowableObject.IMAGES_ROTATION);
  }

  /**
   * Handles the splash event, stopping movement and rotation, playing the splash animation,
   * and then removing the object from the world.
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
   * Stops the horizontal movement of the object by clearing the movement interval.
   */
  stopMoving() {
    clearInterval(this.movementInterval);
  }

  /**
   * Stops the rotation animation of the object by clearing the rotation interval.
   */
  stopRotationAnimation() {
    clearInterval(this.rotationInterval);
  }

  /**
   * Plays the splash animation once.
   * @returns {Promise<void>} A promise that resolves when the splash animation is complete.
   */
  playSplashAnimation() {
    return this.playAnimationOnce(ThrowableObject.IMAGES_SPLASH);
  }

  /**
   * Plays an animation sequence once and resolves a promise upon completion.
   * @param {string[]} images - An array of image paths for the animation.
   * @returns {Promise<void>} A promise that resolves when the animation finishes.
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
   * Removes the throwable object from the game world if it exists within the level's enemies array.
   */
  removeFromWorld() {
    if (this.world) {
      const index = this.world.level.enemies.indexOf(this);
      if (index > -1) this.world.level.enemies.splice(index, 1);
    }
  }
}