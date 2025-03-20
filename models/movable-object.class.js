class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  lastHitTime = 0;
  hitCoolDown = 250;
  health = 10;
  life = 5;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  // Bessere Formel zur Kollisionsberechnung (Genauer)
  isColliding(mo) {
    return (
      this.x + this.width >= mo.x &&
      this.x <= mo.x + mo.width &&
      this.y + this.height >= mo.y &&
      this.y <= mo.y + mo.height
    );
  }

  hit() {
    this.lastHitTime = new Date().getTime();
    this.health -= 10;

    if (this.health == 0) {
      if (this.life > 0) {
        this.health = 100;
        this.life--;
      } else {
        this.removeFromWorld();
        this.lastHitTime = new Date().getTime();
      }
    }
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHitTime; // Difference in ms
    timePassed = timePassed / 1000; // diferenz in secunden
    return timePassed < 1;
  }

  isDead() {
    return this.life <= 0;
  }

  removeFromWorld() {
    this.markedForRemoval = true;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  jump() {
    this.speedY = 30;
  }
}