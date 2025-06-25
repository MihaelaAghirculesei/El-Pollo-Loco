class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  /**
   * Creates a cloud object at a given x position and starts animation.
   * @param {number} x - The initial horizontal position of the cloud.
   */
  constructor(x) {
    super().loadImage(
      "img_pollo_locco/img/5_background/layers/4_clouds/1.png",
      "img_pollo_locco/img/5_background/layers/4_clouds/2.png"
    );
    this.x = x;
    this.canvas = document.getElementById("canvas");
    this.animate();
  }

  /**
   * Starts the animation loop, moving the cloud left and resetting its position if out of view.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
      this.resetIfOutOfView();
    }, 1000 / 60);
  }

  /**
   * Checks if the cloud is out of the visible canvas area and resets its position if so.
   */
  resetIfOutOfView() {
    if (this.x < -this.width) {
      this.resetPosition();
    }
  }

  /**
   * Resets the cloud's position to the right edge of the canvas with a random vertical offset.
   */
  resetPosition() {
    this.x = this.canvas.width + Math.random() * 500;
    this.y = 20 + Math.random() * 50;
  }
}
