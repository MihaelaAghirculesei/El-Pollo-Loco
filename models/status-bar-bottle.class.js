/**
 * Represents a status bar that displays the number of collected bottles.
 * @extends DrawableObject
 */
class StatusBarBottle extends DrawableObject {
  /**
   * The maximum number of bottles that can be collected.
   * @type {number}
   */
  static MAX_BOTTLES = 27;

  /**
   * An array of image paths for the status bar, representing different bottle counts.
   * @type {string[]}
   */
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png"
  ];

  /**
   * The current number of collected bottles.
   * @type {number}
   */
  bottlesCount = 0;

  /**
   * Creates an instance of StatusBarBottle.
   * Initializes the status bar position, loads images, and sets the initial bottle count to 0.
   */
  constructor() {
    super();
    this.setupStatusBar();
    this.loadImages(StatusBarBottle.IMAGES);
    this.setBottlesCount(0);
  }

  /**
   * Sets up the position and dimensions of the status bar.
   */
  setupStatusBar() {
    this.x = 40;
    this.y = 40;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Sets the number of collected bottles and updates the status bar image accordingly.
   * The count is clamped between 0 and MAX_BOTTLES.
   * @param {number} count - The new number of bottles.
   */
  setBottlesCount(count) {
    this.bottlesCount = this.clampBottleCount(count);
    this.updateStatusBarImage();
  }

  /**
   * Clamps the given bottle count to be within the valid range [0, MAX_BOTTLES].
   * @param {number} count - The bottle count to clamp.
   * @returns {number} The clamped bottle count.
   */
  clampBottleCount(count) {
    return Math.max(0, Math.min(count, StatusBarBottle.MAX_BOTTLES));
  }

  /**
   * Updates the image displayed by the status bar based on the current bottle count.
   */
  updateStatusBarImage() {
    const percentage = this.calculatePercentage();
    const imageIndex = this.getImageIndex(percentage);
    this.img = this.imageCache[StatusBarBottle.IMAGES[imageIndex]];
  }

  /**
   * Calculates the percentage of collected bottles relative to the maximum.
   * @returns {number} The percentage of bottles collected (0 to 1).
   */
  calculatePercentage() {
    return this.bottlesCount / StatusBarBottle.MAX_BOTTLES;
  }

  /**
   * Determines the index of the image to display based on the calculated percentage.
   * @param {number} percentage - The percentage of bottles collected (0 to 1).
   * @returns {number} The index of the image in the IMAGES array.
   */
  getImageIndex(percentage) {
    return Math.floor(percentage * (StatusBarBottle.IMAGES.length - 1));
  }
}