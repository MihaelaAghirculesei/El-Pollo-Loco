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

  constructor(x, y, direction = 1) {
    super();
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.splashed = false;
    this.direction = direction;
    this.loadImages(ThrowableObject.IMAGES_ROTATION);
    this.loadImages(ThrowableObject.IMAGES_SPLASH);
    this.setInitialImage();
    this.startThrow();
    this.startRotationAnimation();
  }

  setInitialImage() {
    this.img = this.imageCache[ThrowableObject.IMAGES_ROTATION[0]];
  }

  startThrow() {
    this.speedY = 30;
    this.applyGravity();
    this.startMoving();
  }

  startMoving() {
    let speed = this.getThrowSpeed();
    this.movementInterval = setInterval(
      () => (this.x += speed * this.direction),
      30
    );
  }

  getThrowSpeed() {
    return this.direction === -1 ? 5 : 10;
  }

  startRotationAnimation() {
    this.rotationInterval = setInterval(() => {
      if (!this.splashed) this.playRotationAnimation();
    }, 100);
  }

  playRotationAnimation() {
    this.playAnimation(ThrowableObject.IMAGES_ROTATION);
  }

  splash() {
    this.splashed = true;
    this.stopMoving();
    this.stopRotationAnimation();
    this.y -= 30;
    this.playSplashAnimation().then(() => this.removeFromWorld());
  }

  stopMoving() {
    clearInterval(this.movementInterval);
  }

  stopRotationAnimation() {
    clearInterval(this.rotationInterval);
  }

  playSplashAnimation() {
    return this.playAnimationOnce(ThrowableObject.IMAGES_SPLASH);
  }

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

  removeFromWorld() {
    if (this.world) {
      const index = this.world.level.enemies.indexOf(this);
      if (index > -1) this.world.level.enemies.splice(index, 1);
    }
  }
}
