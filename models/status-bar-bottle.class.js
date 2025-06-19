class StatusBarBottle extends DrawableObject {
  static MAX_BOTTLES = 27;
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png"
  ];

  bottlesCount = 0;

  constructor() {
    super();
    this.setupStatusBar();
    this.loadImages(StatusBarBottle.IMAGES);
    this.setBottlesCount(0);
  }

  setupStatusBar() {
    this.x = 40;
    this.y = 40;
    this.width = 200;
    this.height = 60;
  }

  setBottlesCount(count) {
    this.bottlesCount = this.clampBottleCount(count);
    this.updateStatusBarImage();
  }

  clampBottleCount(count) {
    return Math.max(0, Math.min(count, StatusBarBottle.MAX_BOTTLES));
  }

  updateStatusBarImage() {
    const percentage = this.calculatePercentage();
    const imageIndex = this.getImageIndex(percentage);
    this.img = this.imageCache[StatusBarBottle.IMAGES[imageIndex]];
  }

  calculatePercentage() {
    return this.bottlesCount / StatusBarBottle.MAX_BOTTLES;
  }

  getImageIndex(percentage) {
    return Math.floor(percentage * (StatusBarBottle.IMAGES.length - 1));
  }
}
