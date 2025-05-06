class StatusBarBottle extends DrawableObject {
  MAX_BOTTLES = 10;
  IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];
  percentageBottle = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPosition();
    this.setSize();
    this.setPercentageBottle(0);
  }

  setPosition() {
    this.x = 40;
    this.y = 40;
  }

  setSize() {
    this.width = 200;
    this.height = 60;
  }

  setPercentageBottle(percentage) {
    this.percentageBottle = this.calculatePercentage(percentage);
    this.updateImage();
  }

  calculatePercentage(percentage) {
    if (percentage <= this.MAX_BOTTLES) return percentage * 10;
    return Math.min(percentage, 100);
  }

  updateImage() {
    this.img = this.imageCache[this.resolveImageIndex()];
  }

  resolveImageIndex() {
    const p = this.percentageBottle;
    if (p >= 100) return this.IMAGES[5];
    if (p >= 80)  return this.IMAGES[4];
    if (p >= 60)  return this.IMAGES[3];
    if (p >= 40)  return this.IMAGES[2];
    if (p >= 20)  return this.IMAGES[1];
    return this.IMAGES[0];
  }
}
