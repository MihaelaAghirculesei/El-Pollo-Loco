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

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this instanceof ThrowableObject || this.y < 180;
  }

  isColliding(mo) {
    return (
      this.x + this.collisionOffsetLeft + (this.width - this.collisionOffsetLeft - this.collisionOffsetRight) >= mo.x &&
      this.x + this.collisionOffsetLeft <= mo.x + mo.width &&
      this.y + this.collisionOffsetTop + (this.height - this.collisionOffsetTop - this.collisionOffsetBottom) >= mo.y &&
      this.y + this.collisionOffsetTop <= mo.y + mo.height
    );
  }

  hit() {
    this.lastHitTime = Date.now();
    this.health -= 10;
    if (this.health === 0) {
      if (this.life > 0) {
        this.health = 100;
        this.life--;
      } else {
        this.removeFromWorld();
        this.lastHitTime = Date.now();
      }
    }
  }

  isHurt() {
    return (Date.now() - this.lastHitTime) / 1000 < 1;
  }

  isDead() {
    return this.life <= 0;
  }

  removeFromWorld() {
    this.markedForRemoval = true;
  }

  moveRight() {
    if (this.x + this.width < 720 * 6) this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }
}
