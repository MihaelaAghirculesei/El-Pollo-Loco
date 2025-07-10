/**
 * Status bar for endboss health display.
 */
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

  /**
   * Creates endboss health status bar.
   * @param {object} endboss - Endboss object reference
   */
  constructor(endboss) {
    super();
    this.endboss = endboss;
    this.setupStatusBar();
    this.loadImages(this.IMAGES);
    this.setPercentage(this.endboss.getHealthPercent());
  }

  /**
   * Sets up status bar position and dimensions.
   */
  setupStatusBar() {
    this.x = 495;
    this.y = 5;
    this.width = 200;
    this.height = 67;
  }

  /**
   * Sets health percentage and updates display.
   * @param {number} percentage - Health percentage (0-100)
   */
  setPercentage(percentage) {
    this.percentage = this.clampPercentage(percentage);
    this.updateStatusBarImage();
  }

  /**
   * Clamps percentage to valid range.
   * @param {number} percentage - Percentage to clamp
   * @returns {number} Clamped percentage
   */
  clampPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 100));
  }

  /**
   * Updates status bar image based on percentage.
   */
  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[this.IMAGES[imageIndex]];
  }

  /**
   * Gets correct image index based on percentage.
   * @returns {number} Image index
   */
  getImageIndex() {
    if (this.percentage >= 80) return 5;
    if (this.percentage >= 60) return 4;
    if (this.percentage >= 40) return 3;
    if (this.percentage >= 20) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }

  /**
   * Draws status bar with dynamic positioning.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  draw(ctx) {
    this.updateCanvasPosition(ctx);
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Updates position to stay anchored to right.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  updateCanvasPosition(ctx) {
    this.x = ctx.canvas.width - this.width - 20;
  }

  /**
   * Updates health percentage from endboss.
   */
  updateHealth() {
    if (this.endboss) {
      this.setPercentage(this.endboss.getHealthPercent());
    }
  }
}