/**
 * Represents a status bar displaying the number of collected coins.
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject {
  /**
   * Static array containing paths to the coin status bar images.
   * @type {string[]}
   */
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
  ];

  /**
   * The current percentage of collected coins.
   * @type {number}
   */
  percentageCoins = 0;

  /**
   * Creates an instance of StatusBarCoins.
   * Initializes the status bar's position and dimensions, loads images, and sets the initial percentage to 0.
   */
  constructor() {
    super();
    this.setupStatusBar();
    this.loadImages(StatusBarCoins.IMAGES);
    this.setPercentageCoins(0);
  }

  /**
   * Sets up the initial position and dimensions of the status bar.
   */
  setupStatusBar() {
    this.x = 40;
    this.y = 80;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Sets the percentage of collected coins and updates the status bar image accordingly.
   * The percentage is limited between 0 and 30.
   * @param {number} percentage - The new percentage of coins.
   */
  setPercentageCoins(percentage) {
    this.percentageCoins = this.limitPercentage(percentage);
    this.updateStatusBarImage();
  }

  /**
   * Limits the given percentage to a range between 0 and 30.
   * @param {number} percentage - The percentage to limit.
   * @returns {number} The limited percentage.
   */
  limitPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 30));
  }

  /**
   * Updates the image displayed by the status bar based on the current `percentageCoins`.
   */
  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[StatusBarCoins.IMAGES[imageIndex]];
  }

  /**
   * Calculates the index of the image to be displayed based on the current `percentageCoins`.
   * @returns {number} The index of the image in the `IMAGES` array.
   */
  getImageIndex() {
    return Math.floor(this.percentageCoins / 6);
  }
}