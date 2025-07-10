/**
 * Class representing a small chicken enemy.
 */
class SmallChicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  isDead = false;
  
  IMAGES_DEAD = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];
  
  offset = { top: 5, bottom: 10, left: 10, right: 5 };
  
  IMAGES_WALKING = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Creates small chicken enemy instance.
   * @param {object} world - Game world object
   */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.initializeImages();
    this.initializeProperties(world);
  }

  /**
   * Loads all chicken images.
   */
  initializeImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGES_DEAD[0]);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Initializes chicken properties.
   * @param {object} world - Game world object
   */
  initializeProperties(world) {
    this.x = 600 + Math.random() * 4000;
    this.speed = 0.15 + Math.random() * 0.3;
    this.life = 1;
    this.health = 1;
    this.world = world;
  }

  /**
   * Starts chicken animation and movement.
   */
  animate() {
    this.startMoving();
    this.startWalkingAnimation();
  }

  /**
   * Starts moving chicken left.
   */
  startMoving() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
  }

  /**
   * Starts walking animation cycle.
   */
  startWalkingAnimation() {
    this.walkingInterval = setInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      200
    );
  }

  /**
   * Stops movement and animation intervals.
   */
  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
  }

  /**
   * Handles chicken being hit.
   */
  hit() {
    this.health--;
    if (this.health <= 0) {
      this.die();
    }
  }

  /**
   * Handles chicken death process.
   */
  die() {
    this.isDead = true;
    this.stopMovementAndAnimation();
    this.playDeathAnimation();
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  /**
   * Plays death animation.
   */
  playDeathAnimation() {
    this.loadImages(this.IMAGES_DEAD);
    this.playAnimation(this.IMAGES_DEAD);
  }

  /**
   * Stops character vertical movement.
   */
  stopCharacterVerticalMovement() {
    if (this.world?.character) {
      this.world.character.speedY = 0;
    }
  }

  /**
   * Removes chicken from world after delay.
   */
  removeFromWorldAfterDelay() {
    setTimeout(() => {
      this.removeFromWorld();
      this.markedForRemoval = true;
    }, 110);
  }

  /**
   * Removes chicken from world's enemy list.
   */
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
   * Checks if chicken is dead.
   * @returns {boolean} True if dead
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}