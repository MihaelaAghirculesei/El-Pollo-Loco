/**
 * Status bar for character health display.
 */
class StatusBarHeartCharacter extends DrawableObject {
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
  ];

  /**
   * Creates character health status bar.
   * @param {object} character - Character object reference
   */
  constructor(character) {
    super();
    this.character = character;
    this.setupStatusBar();
    this.loadImages(StatusBarHeartCharacter.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Sets up status bar position and dimensions.
   */
  setupStatusBar() {
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
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
    if (StatusBarHeartCharacter.IMAGES[imageIndex]) {
      this.img = this.imageCache[StatusBarHeartCharacter.IMAGES[imageIndex]];
    }
  }

  /**
   * Gets correct image index based on percentage.
   * @returns {number} Image index
   */
  getImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  /**
   * Draws status bar and heart count.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  draw(ctx) {
    if (this.img) {
      super.draw(ctx);
    }
    this.drawHearts(ctx);
  }

  /**
   * Draws heart count next to status bar.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  drawHearts(ctx) {
    if (this.character && this.character.life > 0) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText(`❤️ x${this.character.life}`, this.x + 220, this.y + 52);
    }
  }
}