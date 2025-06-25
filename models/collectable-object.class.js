class CollectableObject extends DrawableObject {

  /**
   * Creates an instance of CollectableObject.
   * Inherits properties and methods from DrawableObject.
   */
  constructor() {
    super();
  }

  /**
   * Plays the animation by updating the current image and incrementing the image index.
   * @param {string[]} images - Array of image keys used for animation frames.
   */
  playAnimation(images) {
    this.updateImage(images);
    this.incrementImageIndex();
  }

  /**
   * Updates the displayed image based on the current image index.
   * Cycles through the images array using modulo operation.
   * @param {string[]} images - Array of image keys used for animation frames.
   */
  updateImage(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
  }

  /**
   * Increments the current image index to progress the animation frame.
   */
  incrementImageIndex() {
    this.currentImage++;
  }
}
