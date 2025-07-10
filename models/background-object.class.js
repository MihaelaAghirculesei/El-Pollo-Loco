/**
 * Represents a background object that is movable.
 * Extends MovableObject.
 */
class BackgroundObjekt extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new BackgroundObjekt instance.
   * @param {string} imagePath - The path to the background image
   * @param {number} x - The horizontal position of the background object
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; 
  }
}