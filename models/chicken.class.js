/**
 * A walking chicken enemy. {@link SmallChicken} reuses this whole
 * lifecycle and only swaps the values returned by {@link Chicken#spec}.
 */
class Chicken extends MovableObject {
  /**
   * @param {object} world - Reference to the game world object
   */
  constructor(world) {
    super();
    this.applySpec(this.spec());
    this.world = world;
    this.isDead = false;
    this.markedForRemoval = false;
  }

  /**
   * Per-species configuration. Subclasses override this to retune the
   * chicken without touching the lifecycle below.
   * @returns {{walking: string[], dead: string[], width: number, height: number,
   *   spawnX: number, spawnRange: number, minSpeed: number, speedRange: number,
   *   health: number, removalDelay: number}}
   */
  spec() {
    return {
      walking: [
        "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      dead: ["img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"],
      width: 80,
      height: 70,
      spawnX: 800,
      spawnRange: 4500,
      minSpeed: 0.1,
      speedRange: 0.2,
      health: 2,
      removalDelay: 90,
    };
  }

  /**
   * Caches the spec's sprites and applies its stats and spawn position.
   * @param {ReturnType<Chicken['spec']>} s
   */
  applySpec(s) {
    this.imagesWalking = s.walking;
    this.imagesDead = s.dead;
    this.loadImage(s.walking[0]);
    this.loadImages(s.walking);
    this.loadImages(s.dead);
    this.width = s.width;
    this.height = s.height;
    this.y = 360;
    this.life = 1;
    this.health = s.health;
    this.removalDelay = s.removalDelay;
    this.x = s.spawnX + Math.random() * s.spawnRange;
    this.speed = s.minSpeed + Math.random() * s.speedRange;
  }

  /**
   * Starts leftward movement and the walk-cycle animation.
   */
  animate() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
    this.walkingInterval = setInterval(
      () => this.playAnimation(this.imagesWalking),
      200
    );
  }

  /**
   * Applies one point of damage and dies when depleted.
   */
  hit() {
    this.health--;
    if (this.isEnemyDead()) this.die();
  }

  /**
   * Runs the death sequence: stop, show the dead frame, then schedule removal.
   */
  die() {
    this.isDead = true;
    this.stopIntervals();
    this.loadImages(this.imagesDead);
    this.playAnimation(this.imagesDead);
    if (this.world?.character) this.world.character.speedY = 0;
    this.removalTimeout = setTimeout(() => {
      this.removeFromWorld();
      this.markedForRemoval = true;
    }, this.removalDelay);
  }

  /**
   * Clears the movement and animation intervals.
   */
  stopIntervals() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
  }

  /**
   * Stops every loop and pending timer this chicken owns, without running
   * the death sequence. Called when the game ends.
   */
  stop() {
    this.stopIntervals();
    clearTimeout(this.removalTimeout);
  }

  /**
   * Removes this chicken from the world's enemy list.
   */
  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) this.world.level.enemies = enemies.filter((e) => e !== this);
  }

  /**
   * @returns {boolean} True once health is depleted.
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}
