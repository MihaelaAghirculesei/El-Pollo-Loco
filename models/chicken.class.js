/**
 * Class representing a chicken enemy.
 */
class Chicken extends MovableObject {
  static IMAGES_DEAD = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  static IMAGES_WALKING = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Creates a new Chicken instance.
   * @param {object} world - Reference to the game world object
   */
  constructor(world) {
    super();
    this.initializeProperties(world);
    this.loadChickenImages();
  }

  /**
   * Initializes chicken properties.
   * @param {object} world - Game world reference
   */
  initializeProperties(world) {
    this.height = 70;
    this.width = 80;
    this.y = 360;
    this.isDead = false;
    this.life = 1;
    this.health = 2;
    this.world = world;
    this.markedForRemoval = false;
    this.x = 800 + Math.random() * 4500;
    this.speed = 0.1 + Math.random() * 0.2;
  }

  /**
   * Loads all chicken images.
   */
  loadChickenImages() {
    this.loadImage(Chicken.IMAGES_WALKING[0]);
    this.loadImages(Chicken.IMAGES_WALKING);
    this.loadImage(Chicken.IMAGES_DEAD[0]);
    this.loadImages(Chicken.IMAGES_DEAD);
  }

  /**
   * Starts chicken animation and movement.
   */
  animate() {
    this.startMovement();
    this.startWalkingAnimation();
  }

  /**
   * Starts leftward movement at 60 FPS.
   */
  startMovement() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
  }

  /**
   * Starts walking animation cycle.
   */
  startWalkingAnimation() {
    this.walkingInterval = setInterval(
      () => this.playAnimation(Chicken.IMAGES_WALKING),
      200
    );
  }

  /**
   * Handles chicken being hit.
   */
  hit() {
    this.decreaseHealth();
    if (this.isEnemyDead()) this.die();
  }

  /**
   * Decreases chicken health by one.
   */
  decreaseHealth() {
    this.health--;
  }

  /**
   * Handles chicken death sequence.
   */
  die() {
    this.isDead = true;
    this.stopMovementAndAnimation();
    this.playDeathAnimation();
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  /**
   * Stops movement and animation intervals.
   */
  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
  }

  /**
   * Plays death animation.
   */
  playDeathAnimation() {
    this.loadImages(Chicken.IMAGES_DEAD);
    this.playAnimation(Chicken.IMAGES_DEAD);
  }

  /**
   * Stops character vertical movement.
   */
  stopCharacterVerticalMovement() {
    if (this.world?.character) this.world.character.speedY = 0;
  }

  /**
   * Marks chicken for removal.
   */
  markForRemoval() {
    this.markedForRemoval = true;
  }

  /**
   * Removes chicken from world after delay.
   */
  removeFromWorldAfterDelay() {
    setTimeout(() => {
      this.removeFromWorld();
      this.markForRemoval();
    }, 70);
  }

  /**
   * Removes chicken from world's enemy list.
   */
  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) this.world.level.enemies = enemies.filter((e) => e !== this);
  }

  /**
   * Checks if chicken is dead.
   * @returns {boolean} True if dead
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}