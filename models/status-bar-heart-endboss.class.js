/**
 * Represents a status bar for the endboss's health, extending DrawableObject.
 * Displays different images based on the endboss's health percentage.
 */
class StatusBarHeartEndboss extends DrawableObject {
  /**
   * An array of image paths for the different health states of the status bar.
   * @type {string[]}
   */
  IMAGES = [
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/0.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/20.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/40.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/60.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/80.png",
    "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/100.png"
  ];

  /**
   * The current percentage of the status bar, representing the endboss's health.
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates an instance of StatusBarHeartEndboss.
   * @param {object} endboss - The endboss object whose health this status bar will display.
   */
  constructor(endboss) {
    super();
    this.endboss = endboss;
    this.setupStatusBar();
    this.loadImages(this.IMAGES);
    this.setPercentage(this.endboss.getHealthPercent());
  }

  /**
   * Sets up the initial position and dimensions of the status bar.
   */
  setupStatusBar() {
    this.x = 495;
    this.y = 5;
    this.width = 200;
    this.height = 67;
  }

  /**
   * Sets the percentage of the status bar and updates its displayed image.
   * @param {number} percentage - The new percentage value (0-100).
   */
  setPercentage(percentage) {
    this.percentage = this.clampPercentage(percentage);
    this.updateStatusBarImage();
  }

  /**
   * Clamps the given percentage value between 0 and 100.
   * @param {number} percentage - The percentage value to clamp.
   * @returns {number} The clamped percentage value.
   */
  clampPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 100));
  }

  /**
   * Updates the image displayed by the status bar based on the current percentage.
   */
  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[this.IMAGES[imageIndex]];
  }

  /**
   * Determines the correct image index based on the current percentage.
   * @returns {number} The index of the image to be displayed.
   */
  getImageIndex() {
    if (this.percentage >= 80) return 5;
    if (this.percentage >= 60) return 4;
    if (this.percentage >= 40) return 3;
    if (this.percentage >= 20) return 2;
    if (this.percentage > 0) return 1;
  }
  /**
   * Draws the status bar on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  draw(ctx) {
    this.updateCanvasPosition(ctx);
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Updates the x-position of the status bar based on the canvas width to keep it anchored to the right.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  updateCanvasPosition(ctx) {
    this.x = ctx.canvas.width - this.width - 20;
  }

  /**
   * Updates the status bar's health percentage by querying the endboss's current health.
   */
  updateHealth() {
    if (this.endboss) {
      this.setPercentage(this.endboss.getHealthPercent());
    }
  }
}