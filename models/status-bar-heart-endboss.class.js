class StatusBarHeartEndboss extends DrawableObject {
  IMAGES = [
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/0.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/20.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/40.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/60.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/80.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/100.png"
  ];

  percentage = 100;

  constructor(endboss) {
    super();
    this.endboss = endboss;
    this.setupStatusBar();
    this.loadImages(this.IMAGES);
    this.setPercentage(this.endboss.getHealthPercent());
  }

  setupStatusBar() {
    this.x = 495;
    this.y = 5;
    this.width = 200;
    this.height = 67;
  }

  setPercentage(percentage) {
    this.percentage = this.clampPercentage(percentage);
    this.updateStatusBarImage();
  }

  clampPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 100));
  }

  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[this.IMAGES[imageIndex]];
  }

  getImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  draw(ctx) {
    this.updateCanvasPosition(ctx);
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  updateCanvasPosition(ctx) {
    this.x = ctx.canvas.width - this.width - 20;
  }

  updateHealth() {
    if (this.endboss) {
      this.setPercentage(this.endboss.getHealthPercent());
    }
  }
}
