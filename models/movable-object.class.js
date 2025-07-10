/**
 * Base class for movable objects.
 */
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
   * Applies gravity effect to object.
   */
  applyGravity() {
    setInterval(() => {
      this.updateVerticalPosition();
    }, MovableObject.GRAVITY_INTERVAL);
  }

  /**
   * Updates vertical position based on physics.
   */
  updateVerticalPosition() {
    if (this.shouldFall()) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  /**
   * Determines if object should fall.
   * @returns {boolean} True if should fall
   */
  shouldFall() {
    return this.isAboveGround() || this.speedY > 0;
  }

  /**
   * Checks if object is above ground.
   * @returns {boolean} True if above ground
   */
  isAboveGround() {
    return this instanceof ThrowableObject || this.y < MovableObject.GROUND_LEVEL;
  }

  /**
   * Checks collision with another object.
   * @param {MovableObject} mo - Other movable object
   * @returns {boolean} True if colliding
   */
  isColliding(mo) {
    return this.checkHorizontalCollision(mo) && this.checkVerticalCollision(mo);
  }

  /**
   * Checks horizontal collision boundaries.
   * @param {MovableObject} mo - Other object
   * @returns {boolean} True if horizontally colliding
   */
  checkHorizontalCollision(mo) {
    const thisLeft = this.getLeftBoundary();
    const thisRight = this.getRightBoundary();
    const moLeft = mo.x;
    const moRight = mo.x + mo.width;
    
    return thisRight >= moLeft && thisLeft <= moRight;
  }

  /**
   * Gets left collision boundary.
   * @returns {number} Left boundary coordinate
   */
  getLeftBoundary() {
    return this.x + this.collisionOffsetLeft;
  }

  /**
   * Gets right collision boundary.
   * @returns {number} Right boundary coordinate
   */
  getRightBoundary() {
    const leftBoundary = this.getLeftBoundary();
    return leftBoundary + (this.width - this.collisionOffsetLeft - this.collisionOffsetRight);
  }

  /**
   * Checks vertical collision boundaries.
   * @param {MovableObject} mo - Other object
   * @returns {boolean} True if vertically colliding
   */
  checkVerticalCollision(mo) {
    const thisTop = this.getTopBoundary();
    const thisBottom = this.getBottomBoundary();
    const moTop = mo.y;
    const moBottom = mo.y + mo.height;
    
    return thisBottom >= moTop && thisTop <= moBottom;
  }

  /**
   * Gets top collision boundary.
   * @returns {number} Top boundary coordinate
   */
  getTopBoundary() {
    return this.y + this.collisionOffsetTop;
  }

  /**
   * Gets bottom collision boundary.
   * @returns {number} Bottom boundary coordinate
   */
  getBottomBoundary() {
    const topBoundary = this.getTopBoundary();
    return topBoundary + (this.height - this.collisionOffsetTop - this.collisionOffsetBottom);
  }

  /**
   * Handles object getting hit.
   */
  hit() {
    this.updateHitState();
    this.reduceHealth();
    this.handleHealthDepletion();
  }

  /**
   * Updates hit state timestamp.
   */
  updateHitState() {
    this.lastHitTime = Date.now();
  }

  /**
   * Reduces health by damage amount.
   */
  reduceHealth() {
    this.health -= MovableObject.HEALTH_DAMAGE;
  }

  /**
   * Handles health depletion logic.
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
   * Checks if object has remaining lives.
   * @returns {boolean} True if lives left
   */
  hasLivesLeft() {
    return this.life > 0;
  }

  /**
   * Respawns object with full health.
   */
  respawn() {
    this.health = MovableObject.RESPAWN_HEALTH;
    this.life--;
  }

  /**
   * Marks object as dead and removes from world.
   */
  die() {
    this.removeFromWorld();
    this.lastHitTime = Date.now();
  }

  /**
   * Checks if object is in hurt state.
   * @returns {boolean} True if hurt
   */
  isHurt() {
    const timeSinceHit = this.getTimeSinceLastHit();
    return timeSinceHit < MovableObject.HURT_DURATION;
  }

  /**
   * Gets time elapsed since last hit.
   * @returns {number} Time in seconds
   */
  getTimeSinceLastHit() {
    return (Date.now() - this.lastHitTime) / 1000;
  }

  /**
   * Checks if object is dead.
   * @returns {boolean} True if dead
   */
  isDead() {
    return this.life <= 0;
  }

  /**
   * Marks object for removal from world.
   */
  removeFromWorld() {
    this.markedForRemoval = true;
  }

  /**
   * Moves object to the right.
   */
  moveRight() {
    if (this.canMoveRight()) {
      this.x += this.speed;
    }
  }

  /**
   * Checks if object can move right.
   * @returns {boolean} True if can move right
   */
  canMoveRight() {
    return this.x + this.width < MovableObject.WORLD_WIDTH;
  }

  /**
   * Moves object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays animation by cycling through images.
   * @param {string[]} images - Array of image keys
   */
  playAnimation(images) {
    const imageIndex = this.calculateImageIndex(images);
    this.updateCurrentImage(images, imageIndex);
    this.incrementImageCounter();
  }

  /**
   * Calculates current image index.
   * @param {string[]} images - Image array
   * @returns {number} Image index
   */
  calculateImageIndex(images) {
    return this.currentImage % images.length;
  }

  /**
   * Updates current displayed image.
   * @param {string[]} images - Image array
   * @param {number} index - Image index
   */
  updateCurrentImage(images, index) {
    this.img = this.imageCache[images[index]];
  }

  /**
   * Increments image counter for animation.
   */
  incrementImageCounter() {
    this.currentImage++;
  }

  /**
   * Initiates jump by setting vertical speed.
   */
  jump() {
    this.speedY = MovableObject.JUMP_SPEED;
  }
}