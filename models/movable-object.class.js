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

  applyGravity() {
    setInterval(() => {
      this.updateVerticalPosition();
    }, MovableObject.GRAVITY_INTERVAL);
  }

  updateVerticalPosition() {
    if (this.shouldFall()) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  shouldFall() {
    return this.isAboveGround() || this.speedY > 0;
  }

  isAboveGround() {
    return this instanceof ThrowableObject || this.y < MovableObject.GROUND_LEVEL;
  }

  isColliding(mo) {
    return this.checkHorizontalCollision(mo) && this.checkVerticalCollision(mo);
  }

  checkHorizontalCollision(mo) {
    const thisLeft = this.getLeftBoundary();
    const thisRight = this.getRightBoundary();
    const moLeft = mo.x;
    const moRight = mo.x + mo.width;
    
    return thisRight >= moLeft && thisLeft <= moRight;
  }

  getLeftBoundary() {
    return this.x + this.collisionOffsetLeft;
  }

  getRightBoundary() {
    const leftBoundary = this.getLeftBoundary();
    return leftBoundary + (this.width - this.collisionOffsetLeft - this.collisionOffsetRight);
  }

  checkVerticalCollision(mo) {
    const thisTop = this.getTopBoundary();
    const thisBottom = this.getBottomBoundary();
    const moTop = mo.y;
    const moBottom = mo.y + mo.height;
    
    return thisBottom >= moTop && thisTop <= moBottom;
  }

  getTopBoundary() {
    return this.y + this.collisionOffsetTop;
  }

  getBottomBoundary() {
    const topBoundary = this.getTopBoundary();
    return topBoundary + (this.height - this.collisionOffsetTop - this.collisionOffsetBottom);
  }

  hit() {
    this.updateHitState();
    this.reduceHealth();
    this.handleHealthDepletion();
  }

  updateHitState() {
    this.lastHitTime = Date.now();
  }

  reduceHealth() {
    this.health -= MovableObject.HEALTH_DAMAGE;
  }

  handleHealthDepletion() {
    if (this.health === 0) {
      if (this.hasLivesLeft()) {
        this.respawn();
      } else {
        this.die();
      }
    }
  }

  hasLivesLeft() {
    return this.life > 0;
  }

  respawn() {
    this.health = MovableObject.RESPAWN_HEALTH;
    this.life--;
  }

  die() {
    this.removeFromWorld();
    this.lastHitTime = Date.now();
  }

  isHurt() {
    const timeSinceHit = this.getTimeSinceLastHit();
    return timeSinceHit < MovableObject.HURT_DURATION;
  }

  getTimeSinceLastHit() {
    return (Date.now() - this.lastHitTime) / 1000;
  }

  isDead() {
    return this.life <= 0;
  }

  removeFromWorld() {
    this.markedForRemoval = true;
  }

  moveRight() {
    if (this.canMoveRight()) {
      this.x += this.speed;
    }
  }

  canMoveRight() {
    return this.x + this.width < MovableObject.WORLD_WIDTH;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    const imageIndex = this.calculateImageIndex(images);
    this.updateCurrentImage(images, imageIndex);
    this.incrementImageCounter();
  }

  calculateImageIndex(images) {
    return this.currentImage % images.length;
  }

  updateCurrentImage(images, index) {
    this.img = this.imageCache[images[index]];
  }

  incrementImageCounter() {
    this.currentImage++;
  }

  jump() {
    this.speedY = MovableObject.JUMP_SPEED;
  }
}