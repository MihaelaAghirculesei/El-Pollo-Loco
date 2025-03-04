class CollectableObject extends DrawableObject {
    collect_sound;
  
    constructor() {
      super();
    }
  
    /**
     * The function pauses a sound with a playback rate of 1.
     */
    playAudio() {
      this.collect_sound.playbackRate = 1;
      this.collect_sound.pause();
    }
  
    /**
     * The function plays an animation by cycling through a list of images.
     * @param images - The parameter "images" is an array of strings that represent the file paths of the
     * images to be used in the animation.
     */
    playAnimation(images) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  
    /**
     * The function collects an item in a game world and removes it from the list of collectable items.
     * @param item - The "item" parameter is a variable that represents the collectable item that the
     * player has collected in the game. It could be a coin, a power-up, or any other item that the player
     * needs to collect to progress in the game.
     */
    collectItem(item) {
      this.isCollected = true;
      this.collect_sound.playbackRate = 2;
      world.playSound(this.collect_sound);
      let indexofitem = world.getIndexOfItem(world.level.collectableItems, item);
      world.level.collectableItems.splice(indexofitem, 1);
    }
  }
  