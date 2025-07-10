/**
 * Status bar for coin collection display.
 */
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

  /**
   * Creates coin status bar instance.
   */
  constructor() {
    super();
    this.setupStatusBar();
    this.loadImages(StatusBarCoins.IMAGES);
    this.setPercentageCoins(0);
  }

  /**
   * Sets up status bar position and dimensions.
   */
  setupStatusBar() {
    this.x = 40;
    this.y = 80;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Sets coin percentage and updates display.
   * @param {number} percentage - New coin percentage
   */
  setPercentageCoins(percentage) {
    this.percentageCoins = this.limitPercentage(percentage);
    this.updateStatusBarImage();
  }

  /**
   * Limits percentage to valid range.
   * @param {number} percentage - Percentage to limit
   * @returns {number} Limited percentage
   */
  limitPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 30));
  }

  /**
   * Updates status bar image based on percentage.
   */
  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[StatusBarCoins.IMAGES[imageIndex]];
  }

  /**
   * Gets image index based on current percentage.
   * @returns {number} Image index
   */
  getImageIndex() {
    return Math.floor(this.percentageCoins / 6);
  }
}