class Bottle extends MovableObject {
  constructor(x, y = 380) {
    super();
    this.initConstants();
    this.initializeProperties(x, y);
    this.loadBottleImages();
    this.startAnimation();
  }

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

  initializeProperties(x, y) {
    this.x = x;
    this.y = y;
    this.height = this.defaultSize;
    this.width = this.defaultSize;
    this.isCollected = false;
    this.offset = { ...this.defaultOffset };
    this.animationInterval = null;
  }

  loadBottleImages() {
    this.loadImage(this.bottleImages[0]);
    this.loadImages(this.bottleImages);
  }

  startAnimation() {
    this.stopAnimation();
    this.setupAnimationInterval();
  }

  setupAnimationInterval() {
    this.animationInterval = setInterval(() => {
      if (!this.isCollected) {
        this.playAnimation(this.bottleImages);
      }
    }, this.animationSpeed);
  }

  stopAnimation() {
    if (this.animationInterval) {
      this.clearAnimationInterval();
    }
  }

  clearAnimationInterval() {
    clearInterval(this.animationInterval);
    this.animationInterval = null;
  }

  collect() {
    this.isCollected = true;
    this.stopAnimation();
  }

  destroy() {
    this.stopAnimation();
  }
}
