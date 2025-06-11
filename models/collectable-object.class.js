class CollectableObject extends DrawableObject {

  constructor() {
    super();
  }

  playAnimation(images) {
    this.updateImage(images);
    this.incrementImageIndex();
  }

  updateImage(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
  }

  incrementImageIndex() {
    this.currentImage++;
  }
}
