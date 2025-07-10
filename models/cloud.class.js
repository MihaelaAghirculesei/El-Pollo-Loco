/**
 * Class representing a moving cloud.
 */
class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  /**
   * Creates a cloud at given position.
   * @param {number} x - Initial horizontal position
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
   * Starts cloud animation loop.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
      this.resetIfOutOfView();
    }, 1000 / 60);
  }

  /**
   * Resets cloud position if out of view.
   */
  resetIfOutOfView() {
    if (this.x < -this.width) {
      this.resetPosition();
    }
  }

  /**
   * Resets cloud to right edge with random offset.
   */
  resetPosition() {
    this.x = this.canvas.width + Math.random() * 500;
    this.y = 20 + Math.random() * 50;
  }
}