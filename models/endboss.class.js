/**
 * Class representing the Endboss enemy character.
 * Extends MovableObject to add specific behaviors and properties.
 */
class Endboss extends MovableObject {
  MAX_HEALTH = 200;
  DAMAGE_AMOUNT = 1;
  DISTANCE_TO_KEEP = 50;
  ANIMATION_SPEED = 150;
  REMOVAL_DELAY = 1000;

  IMAGES_WALKING = [
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_HURT = [
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  IMAGES_STAY = [
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * Constructs the Endboss object and initializes images and properties.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.initializeProperties();
  }

  /**
   * Loads all image arrays for the Endboss animations.
   */
  loadAllImages() {
    [this.IMAGES_WALKING, this.IMAGES_HURT, this.IMAGES_STAY].forEach((imgs) =>
      this.loadImages(imgs)
    );
  }

  /**
   * Initializes dimensions, position, stats, and movement state.
   */
  initializeProperties() {
    this.setDimensions();
    this.setPosition();
    this.setStats();
    this.setMovementState();
  }

  /**
   * Sets the size of the Endboss.
   */
  setDimensions() {
    this.height = 400;
    this.width = 250;
  }

  /**
   * Sets the initial position of the Endboss.
   */
  setPosition() {
    this.y = 60;
    this.x = 4000;
  }

  /**
   * Sets health, speed and death state of the Endboss.
   */
  setStats() {
    this.health = this.MAX_HEALTH;
    this.speed = 7;
    this.isDead = false;
  }

  /**
   * Sets the initial movement state flags.
   */
  setMovementState() {
    this.walking = true;
    this._isMoving = false;
    this._moveInterval = null;
  }

  /**
   * Starts the Endboss movement and animation if not already moving.
   */
  startMoving() {
    if (!this._isMoving) {
      this._isMoving = true;
      this.animate();
    }
  }

  /**
   * Starts the animation loop if not already running.
   */
  animate() {
    if (this.isAlreadyAnimating()) return;
    this.startAnimationLoop();
  }

  /**
   * Checks if the animation loop is already active.
   * @returns {boolean} True if animation loop is running, else false.
   */
  isAlreadyAnimating() {
    return this._moveInterval !== null;
  }

  /**
   * Initiates a repeating interval for movement and animation.
   */
  startAnimationLoop() {
    this._moveInterval = setInterval(() => {
      this.executeMovementCycle();
    }, this.ANIMATION_SPEED);
  }

  /**
   * Performs one cycle of movement and plays walking animation.
   */
  executeMovementCycle() {
    this.move();
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Moves the Endboss according to the character's position.
   */
  move() {
    if (!this.hasValidCharacter()) return;
    const characterX = this.getCharacterPosition();
    this.adjustPosition(characterX, this.DISTANCE_TO_KEEP);
  }

  /**
   * Retrieves the X position of the player character.
   * @returns {number} The character's X coordinate.
   */
  getCharacterPosition() {
    return this.world.character.x;
  }

  /**
   * Checks if a valid character reference exists.
   * @returns {boolean} True if character exists, false otherwise.
   */
  hasValidCharacter() {
    return this.world?.character;
  }

  /**
   * Adjusts the Endboss position to keep a certain distance from the character.
   * @param {number} characterX - The X position of the character.
   * @param {number} distanceToKeep - The desired minimum distance.
   */
  adjustPosition(characterX, distanceToKeep) {
    if (this.shouldMoveRight(characterX, distanceToKeep)) {
      this.moveRight();
    } else if (this.shouldMoveLeft(characterX, distanceToKeep)) {
      this.moveLeft();
    }
  }

  /**
   * Determines if Endboss should move right.
   * @param {number} characterX - The character's X position.
   * @param {number} distanceToKeep - Minimum distance to keep.
   * @returns {boolean} True if should move right.
   */
  shouldMoveRight(characterX, distanceToKeep) {
    return this.x < characterX - distanceToKeep;
  }

  /**
   * Determines if Endboss should move left.
   * @param {number} characterX - The character's X position.
   * @param {number} distanceToKeep - Minimum distance to keep.
   * @returns {boolean} True if should move left.
   */
  shouldMoveLeft(characterX, distanceToKeep) {
    return this.x > characterX + distanceToKeep;
  }

  /**
   * Moves the Endboss to the right.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  /**
   * Moves the Endboss to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  /**
   * Calculates the Endboss health as a percentage.
   * @returns {number} Health percentage (0-100).
   */
  getHealthPercent() {
    return Math.max(0, Math.round((this.health / this.MAX_HEALTH) * 100));
  }

  /**
   * Applies damage to the Endboss and triggers hurt effects.
   */
  hit() {
    if (this.isDead) return;
    this.reduceHealth();
    this.playHurtEffects();
    this.checkIfDead();
  }

  /**
   * Decreases the Endboss health by the damage amount.
   */
  reduceHealth() {
    this.health -= this.DAMAGE_AMOUNT;
    this.ensureHealthNotNegative();
  }

  /**
   * Prevents health from dropping below zero.
   */
  ensureHealthNotNegative() {
    if (this.health < 0) this.health = 0;
  }

  /**
   * Plays sound and animation effects when the Endboss is hurt.
   */
  playHurtEffects() {
    this.playHurtSound();
    this.playHurtAnimationIfAlive();
  }

  /**
   * Plays the hurt sound effect.
   */
  playHurtSound() {
    playEndbossHurtSound();
  }

  /**
   * Plays hurt animation if the Endboss is still alive.
   */
  playHurtAnimationIfAlive() {
    if (this.health > 0) {
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  /**
   * Checks if the Endboss health is zero or below and triggers death if so.
   */
  checkIfDead() {
    if (this.health <= 0) {
      this.die();
    }
  }

  /**
   * Handles the death of the Endboss.
   */
  die() {
    this.isDead = true;
    this.playDeathEffects();
    this.stopMovement();
    this.scheduleRemoval();
  }

  /**
   * Plays death animation and sound.
   */
  playDeathEffects() {
    this.playDeathAnimation();
    this.playDeathSound();
  }

  /**
   * Plays the death animation.
   */
  playDeathAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Plays the death sound effect.
   */
  playDeathSound() {
    playEndbossHurtSound();
  }

  /**
   * Stops the movement animation loop.
   */
  stopMovement() {
    if (this.hasActiveMovement()) {
      this.clearMovementInterval();
    }
  }

  /**
   * Checks if the movement animation loop is active.
   * @returns {boolean} True if movement loop is active.
   */
  hasActiveMovement() {
    return this._moveInterval !== null;
  }

  /**
   * Clears the interval responsible for movement animation.
   */
  clearMovementInterval() {
    clearInterval(this._moveInterval);
    this._moveInterval = null;
  }

  /**
   * Schedules removal of the Endboss from the world after a delay.
   */
  scheduleRemoval() {
    setTimeout(() => this.removeFromWorld(), this.REMOVAL_DELAY);
  }

  /**
   * Triggers the Endboss attack sound effect.
   */
  attack() {
    playEndbossAttackSound();
  }

  /**
   * Removes the Endboss from the world's enemy list.
   */
  removeFromWorld() {
    if (this.world?.level?.enemies) {
      this.world.level.enemies = this.world.level.enemies.filter(
        (e) => e !== this
      );
    }
  }

  /**
   * Checks if the Endboss is dead.
   * @returns {boolean} True if health is zero or less.
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}
