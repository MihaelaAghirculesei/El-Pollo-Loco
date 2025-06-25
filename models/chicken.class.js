class Chicken extends MovableObject {
  /**
   * Array of image paths for the dead chicken animation.
   * @type {string[]}
   */
  static IMAGES_DEAD = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  /**
   * Array of image paths for the walking chicken animation.
   * @type {string[]}
   */
  static IMAGES_WALKING = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Creates a new Chicken instance.
   * @param {object} world - Reference to the game world object.
   */
  constructor(world) {
    super();
    this.height = 70;
    this.width = 80;
    this.y = 360;
    this.isDead = false;
    this.life = 1;
    this.health = 2;
    this.world = world;
    this.markedForRemoval = false;
    this.x = 800 + Math.random() * 4500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.loadImage(Chicken.IMAGES_WALKING[0]);
    this.loadImages(Chicken.IMAGES_WALKING);
    this.loadImage(Chicken.IMAGES_DEAD[0]);
    this.loadImages(Chicken.IMAGES_DEAD);
  }

  /**
   * Starts the chicken's animation and movement.
   */
  animate() {
    this.startMovement();
    this.startWalkingAnimation();
  }

  /**
   * Starts the leftward movement of the chicken at 60 FPS.
   */
  startMovement() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
  }

  /**
   * Starts the walking animation cycling through images every 200 milliseconds.
   */
  startWalkingAnimation() {
    this.walkingInterval = setInterval(
      () => this.playAnimation(Chicken.IMAGES_WALKING),
      200
    );
  }

  /**
   * Handles the chicken being hit by decreasing health and checking if it should die.
   */
  hit() {
    this.decreaseHealth();
    if (this.isEnemyDead()) this.die();
  }

  /**
   * Decreases the chicken's health by one.
   */
  decreaseHealth() {
    this.health--;
  }

  /**
   * Handles the chicken's death: marks as dead, stops animations and movement,
   * plays death animation, stops vertical movement, and schedules removal from the world.
   */
  die() {
    this.isDead = true;
    this.stopMovementAndAnimation();
    this.loadImages(Chicken.IMAGES_DEAD);
    this.playAnimation(Chicken.IMAGES_DEAD);
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  /**
   * Stops movement and walking animation intervals.
   */
  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
  }

  /**
   * Stops vertical movement of the main character if it exists in the world.
   */
  stopCharacterVerticalMovement() {
    if (this.world?.character) this.world.character.speedY = 0;
  }

  /**
   * Marks this chicken for removal from the game world.
   */
  markForRemoval() {
    this.markedForRemoval = true;
  }

  /**
   * Removes the chicken from the game world after a short delay.
   */
  removeFromWorldAfterDelay() {
    setTimeout(() => {
      this.removeFromWorld();
      this.markForRemoval();
    }, 70);
  }

  /**
   * Removes this chicken instance from the world's enemy list.
   */
  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) this.world.level.enemies = enemies.filter((e) => e !== this);
  }

  /**
   * Checks if the chicken's health is zero or less, indicating it is dead.
   * @returns {boolean} True if the chicken is dead, otherwise false.
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}
