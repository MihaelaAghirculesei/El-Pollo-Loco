class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  lastHitTime = 0;
  hitCoolDown = 250;
  health = 10;
  life = 5;
  markedForRemoval = false;
  
  static GRAVITY_INTERVAL = 1000 / 25;
  static GROUND_LEVEL = 180;
  static HURT_DURATION = 1;
  static HEALTH_DAMAGE = 10;
  static RESPAWN_HEALTH = 100;
  static JUMP_SPEED = 30;
  static WORLD_WIDTH = 720 * 6;

  /**
   * Applies gravity effect by periodically updating vertical position.
   */
  applyGravity() {
    setInterval(() => {
      this.updateVerticalPosition();
    }, MovableObject.GRAVITY_INTERVAL);
  }

  /**
   * Updates the vertical position based on current speed and acceleration.
   */
  updateVerticalPosition() {
    if (this.shouldFall()) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  /**
   * Determines if the object should fall (if above ground or moving upwards).
   * @returns {boolean}
   */
  shouldFall() {
    return this.isAboveGround() || this.speedY > 0;
  }

  /**
   * Checks if the object is above ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    return this instanceof ThrowableObject || this.y < MovableObject.GROUND_LEVEL;
  }

  /**
   * Checks if this object is colliding with another movable object.
   * @param {MovableObject} mo - The other movable object.
   * @returns {boolean}
   */
  isColliding(mo) {
    return this.checkHorizontalCollision(mo) && this.checkVerticalCollision(mo);
  }

  /**
   * Checks horizontal collision boundaries with another object.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  checkHorizontalCollision(mo) {
    const thisLeft = this.getLeftBoundary();
    const thisRight = this.getRightBoundary();
    const moLeft = mo.x;
    const moRight = mo.x + mo.width;
    
    return thisRight >= moLeft && thisLeft <= moRight;
  }

  /**
   * Gets the left collision boundary coordinate.
   * @returns {number}
   */
  getLeftBoundary() {
    return this.x + this.collisionOffsetLeft;
  }

  /**
   * Gets the right collision boundary coordinate.
   * @returns {number}
   */
  getRightBoundary() {
    const leftBoundary = this.getLeftBoundary();
    return leftBoundary + (this.width - this.collisionOffsetLeft - this.collisionOffsetRight);
  }

  /**
   * Checks vertical collision boundaries with another object.
   * @param {MovableObject} mo
   * @returns {boolean}
   */
  checkVerticalCollision(mo) {
    const thisTop = this.getTopBoundary();
    const thisBottom = this.getBottomBoundary();
    const moTop = mo.y;
    const moBottom = mo.y + mo.height;
    
    return thisBottom >= moTop && thisTop <= moBottom;
  }

  /**
   * Gets the top collision boundary coordinate.
   * @returns {number}
   */
  getTopBoundary() {
    return this.y + this.collisionOffsetTop;
  }

  /**
   * Gets the bottom collision boundary coordinate.
   * @returns {number}
   */
  getBottomBoundary() {
    const topBoundary = this.getTopBoundary();
    return topBoundary + (this.height - this.collisionOffsetTop - this.collisionOffsetBottom);
  }

  /**
   * Handles the object getting hit: updates hit state and health.
   */
  hit() {
    this.updateHitState();
    this.reduceHealth();
    this.handleHealthDepletion();
  }

  /**
   * Updates the time of the last hit to current time.
   */
  updateHitState() {
    this.lastHitTime = Date.now();
  }

  /**
   * Reduces health by predefined damage amount.
   */
  reduceHealth() {
    this.health -= MovableObject.HEALTH_DAMAGE;
  }

  /**
   * Checks health and handles respawn or death if health reaches zero.
   */
  handleHealthDepletion() {
    if (this.health === 0) {
      if (this.hasLivesLeft()) {
        this.respawn();
      } else {
        this.die();
      }
    }
  }

  /**
   * Checks if the object has remaining lives.
   * @returns {boolean}
   */
  hasLivesLeft() {
    return this.life > 0;
  }

  /**
   * Respawns the object by resetting health and reducing life count.
   */
  respawn() {
    this.health = MovableObject.RESPAWN_HEALTH;
    this.life--;
  }

  /**
   * Marks the object as dead and removes it from the world.
   */
  die() {
    this.removeFromWorld();
    this.lastHitTime = Date.now();
  }

  /**
   * Checks if the object is currently in a hurt state.
   * @returns {boolean}
   */
  isHurt() {
    const timeSinceHit = this.getTimeSinceLastHit();
    return timeSinceHit < MovableObject.HURT_DURATION;
  }

  /**
   * Gets the time elapsed since the last hit in seconds.
   * @returns {number}
   */
  getTimeSinceLastHit() {
    return (Date.now() - this.lastHitTime) / 1000;
  }

  /**
   * Checks if the object is dead (no lives left).
   * @returns {boolean}
   */
  isDead() {
    return this.life <= 0;
  }

  /**
   * Marks the object for removal from the game world.
   */
  removeFromWorld() {
    this.markedForRemoval = true;
  }

  /**
   * Moves the object to the right if possible.
   */
  moveRight() {
    if (this.canMoveRight()) {
      this.x += this.speed;
    }
  }

  /**
   * Checks if the object can move right within world bounds.
   * @returns {boolean}
   */
  canMoveRight() {
    return this.x + this.width < MovableObject.WORLD_WIDTH;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays an animation by cycling through the given images.
   * @param {string[]} images - Array of image keys.
   */
  playAnimation(images) {
    const imageIndex = this.calculateImageIndex(images);
    this.updateCurrentImage(images, imageIndex);
    this.incrementImageCounter();
  }

  /**
   * Calculates the current image index based on the image counter.
   * @param {string[]} images
   * @returns {number}
   */
  calculateImageIndex(images) {
    return this.currentImage % images.length;
  }

  /**
   * Updates the current displayed image from the cache.
   * @param {string[]} images
   * @param {number} index
   */
  updateCurrentImage(images, index) {
    this.img = this.imageCache[images[index]];
  }

  /**
   * Increments the internal image counter for animation.
   */
  incrementImageCounter() {
    this.currentImage++;
  }

  /**
   * Initiates a jump by setting the vertical speed.
   */
  jump() {
    this.speedY = MovableObject.JUMP_SPEED;
  }
}
