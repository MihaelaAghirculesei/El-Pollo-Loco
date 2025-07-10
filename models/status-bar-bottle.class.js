/**
 * Status bar for bottle collection display.
 */
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

  /**
   * Creates bottle status bar instance.
   */
  constructor() {
    super();
    this.setupStatusBar();
    this.loadImages(StatusBarBottle.IMAGES);
    this.setBottlesCount(0);
  }

  /**
   * Sets up status bar position and dimensions.
   */
  setupStatusBar() {
    this.x = 40;
    this.y = 40;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Sets bottle count and updates display.
   * @param {number} count - New bottle count
   */
  setBottlesCount(count) {
    this.bottlesCount = this.clampBottleCount(count);
    this.updateStatusBarImage();
  }

  /**
   * Clamps bottle count to valid range.
   * @param {number} count - Bottle count to clamp
   * @returns {number} Clamped bottle count
   */
  clampBottleCount(count) {
    return Math.max(0, Math.min(count, StatusBarBottle.MAX_BOTTLES));
  }

  /**
   * Updates status bar image based on current count.
   */
  updateStatusBarImage() {
    const percentage = this.calculatePercentage();
    const imageIndex = this.getImageIndex(percentage);
    this.img = this.imageCache[StatusBarBottle.IMAGES[imageIndex]];
  }

  /**
   * Calculates percentage of collected bottles.
   * @returns {number} Percentage (0 to 1)
   */
  calculatePercentage() {
    return this.bottlesCount / StatusBarBottle.MAX_BOTTLES;
  }

  /**
   * Gets image index based on percentage.
   * @param {number} percentage - Percentage (0 to 1)
   * @returns {number} Image index
   */
  getImageIndex(percentage) {
    return Math.floor(percentage * (StatusBarBottle.IMAGES.length - 1));
  }
}