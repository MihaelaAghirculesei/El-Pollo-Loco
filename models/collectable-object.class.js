/**
 * Base class for collectible objects.
 */
class CollectableObject extends DrawableObject {
  /**
   * Creates a collectible object instance.
   */
  constructor() {
    super();
  }

  /**
   * Plays animation by updating current image.
   * @param {string[]} images - Array of image keys
   */
  playAnimation(images) {
    this.updateImage(images);
    this.incrementImageIndex();
  }

  /**
   * Updates displayed image based on current index.
   * @param {string[]} images - Array of image keys
   */
  updateImage(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
  }

  /**
   * Increments current image index.
   */
  incrementImageIndex() {
    this.currentImage++;
  }
}