class CollectableObject extends DrawableObject {
  collect_sound;

  constructor() {
    super();
  }

  playAudio() {
    this.setNormalPlaybackRate();
    this.pauseSound();
  }

  setNormalPlaybackRate() {
    this.collect_sound.playbackRate = 1;
  }

  pauseSound() {
    this.collect_sound.pause();
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

  collectItem(item) {
    this.markAsCollected();
    this.setFastPlaybackRate();
    this.removeFromWorld(item);
  }

  markAsCollected() {
    this.isCollected = true;
  }

  setFastPlaybackRate() {
    this.collect_sound.playbackRate = 2;
  }

  removeFromWorld(item) {
    const index = world.getIndexOfItem(world.level.collectableItems, item);
    if (index !== -1) world.level.collectableItems.splice(index, 1);
  }
}
