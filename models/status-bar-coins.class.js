class StatusBarCoins extends DrawableObject {
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
  ];

  percentageCoins = 0;

  constructor() {
    super();
    this.setupStatusBar();
    this.loadImages(StatusBarCoins.IMAGES);
    this.setPercentageCoins(0);
  }

  setupStatusBar() {
    this.x = 40;
    this.y = 80;
    this.width = 200;
    this.height = 60;
  }

  setPercentageCoins(percentage) {
    this.percentageCoins = this.limitPercentage(percentage);
    this.updateStatusBarImage();
  }

  limitPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 30));
  }

  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[StatusBarCoins.IMAGES[imageIndex]];
  }

  getImageIndex() {
    return Math.floor(this.percentageCoins / 6);
  }
}
