/**
 * Class representing a small chicken enemy that moves and can be killed.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  /** @type {number} Vertical position of the chicken */
  y = 360;
  /** @type {number} Height of the chicken */
  height = 60;
  /** @type {number} Width of the chicken */
  width = 60;
  /** @type {boolean} Flag indicating if the chicken is dead */
  isDead = false;
  
  /** @type {string[]} Image paths for the dead animation */
  IMAGES_DEAD = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];
  
  /** @type {{top:number, bottom:number, left:number, right:number}} Collision offset */
  offset = { top: 5, bottom: 10, left: 10, right: 5 };
  
  /** @type {string[]} Image paths for the walking animation */
  IMAGES_WALKING = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Creates a small chicken enemy instance.
   * @param {object} world - The game world object the chicken belongs to.
   */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.initializeImages();
    this.x = 600 + Math.random() * 4000;
    this.speed = 0.15 + Math.random() * 0.3;
    this.life = 1;
    this.health = 1;
    this.world = world;
  }

  /** Loads all walking and dead images for the chicken */
  initializeImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGES_DEAD[0]);
    this.loadImages(this.IMAGES_DEAD);
  }

  /** Starts the movement and walking animation of the chicken */
  animate() {
    this.startMoving();
    this.startWalkingAnimation();
  }

  /** Starts moving the chicken left at a fixed interval */
  startMoving() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
  }

  /** Starts cycling through walking images to animate walking */
  startWalkingAnimation() {
    this.walkingInterval = setInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      200
    );
  }

  /** Stops both movement and walking animation intervals */
  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
  }

  /**
   * Called when the chicken is hit by the player or projectile.
   * Decreases health and triggers death if health reaches zero.
   */
  hit() {
    this.health--;
    if (this.health <= 0) {
      this.die();
    }
  }

  /** Handles the death process of the chicken */
  die() {
    this.isDead = true;
    this.stopMovementAndAnimation();
    this.playDeathAnimation();
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  /** Plays the death animation images */
  playDeathAnimation() {
    this.loadImages(this.IMAGES_DEAD);
    this.playAnimation(this.IMAGES_DEAD);
  }

  /** Stops the vertical movement of the character in the game world */
  stopCharacterVerticalMovement() {
    if (this.world?.character) {
      this.world.character.speedY = 0;
    }
  }

  /** Removes the chicken from the world after a short delay */
  removeFromWorldAfterDelay() {
    setTimeout(() => {
      this.removeFromWorld();
      this.markedForRemoval = true;
    }, 110);
  }

  /** Removes this chicken instance from the world's enemy list */
  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) {
      const enemyIndex = enemies.indexOf(this);
      if (enemyIndex !== -1) {
        enemies.splice(enemyIndex, 1);
      }
    }
  }

  /**
   * Checks if the chicken enemy is dead.
   * @returns {boolean} True if health is 0 or less.
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}
