/**
 * Represents a status bar displaying the character's health as hearts.
 * @extends DrawableObject
 */
class StatusBarHeartCharacter extends DrawableObject {
  /**
   * Static array of image paths for the different health percentages.
   * @type {string[]}
   */
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
  ];

  /**
   * Creates an instance of StatusBarHeartCharacter.
   * @param {object} character - The character object whose health is to be displayed.
   */
  constructor(character) {
    super();
    this.character = character;
    this.setupStatusBar();
    this.loadImages(StatusBarHeartCharacter.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Sets up the initial position and dimensions of the status bar.
   */
  setupStatusBar() {
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Sets the percentage of the status bar and updates its image.
   * @param {number} percentage - The health percentage (0-100).
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
   * Updates the image of the status bar based on the current percentage.
   */
  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    if (StatusBarHeartCharacter.IMAGES[imageIndex]) {
      this.img = this.imageCache[StatusBarHeartCharacter.IMAGES[imageIndex]];
    }
  }

  /**
   * Determines the correct image index based on the current percentage.
   * @returns {number} The index of the image to display.
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
   * Draws the status bar and the heart count on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  draw(ctx) {
    if (this.img) {
      super.draw(ctx);
    }
    this.drawHearts(ctx);
  }

  /**
   * Draws the heart count next to the status bar if the character has life remaining.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  drawHearts(ctx) {
    if (this.character && this.character.life > 0) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText(`❤️ x${this.character.life}`, this.x + 220, this.y + 52);
    }
  }
}