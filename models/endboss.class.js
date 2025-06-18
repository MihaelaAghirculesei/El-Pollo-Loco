class Endboss extends MovableObject {
  MAX_HEALTH = 200;
  DAMAGE_AMOUNT = 1;
  DISTANCE_TO_KEEP = 50;
  ANIMATION_SPEED = 100;
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

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.initializeProperties();
  }

  loadAllImages() {
    [this.IMAGES_WALKING, this.IMAGES_HURT, this.IMAGES_STAY].forEach((imgs) =>
      this.loadImages(imgs)
    );
  }

  initializeProperties() {
    this.setDimensions();
    this.setPosition();
    this.setStats();
    this.setMovementState();
  }

  setDimensions() {
    this.height = 400;
    this.width = 250;
  }

  setPosition() {
    this.y = 60;
    this.x = 4000;
  }

  setStats() {
    this.health = this.MAX_HEALTH;
    this.speed = 7;
    this.isDead = false;
  }

  setMovementState() {
    this.walking = true;
    this._isMoving = false;
    this._moveInterval = null;
  }

  startMoving() {
    if (!this._isMoving) {
      this._isMoving = true;
      this.animate();
    }
  }

  animate() {
    if (this.isAlreadyAnimating()) return;
    this.startAnimationLoop();
  }

  isAlreadyAnimating() {
    return this._moveInterval !== null;
  }

  startAnimationLoop() {
    this._moveInterval = setInterval(() => {
      this.executeMovementCycle();
    }, this.ANIMATION_SPEED);
  }

  executeMovementCycle() {
    this.move();
    this.playAnimation(this.IMAGES_WALKING);
  }

  move() {
    if (!this.hasValidCharacter()) return;
    const characterX = this.getCharacterPosition();
    this.adjustPosition(characterX, this.DISTANCE_TO_KEEP);
  }

  getCharacterPosition() {
    return this.world.character.x;
  }

  hasValidCharacter() {
    return this.world?.character;
  }

  adjustPosition(characterX, distanceToKeep) {
    if (this.shouldMoveRight(characterX, distanceToKeep)) {
      this.moveRight();
    } else if (this.shouldMoveLeft(characterX, distanceToKeep)) {
      this.moveLeft();
    }
  }

  shouldMoveRight(characterX, distanceToKeep) {
    return this.x < characterX - distanceToKeep;
  }

  shouldMoveLeft(characterX, distanceToKeep) {
    return this.x > characterX + distanceToKeep;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  getHealthPercent() {
    return Math.max(0, Math.round((this.health / this.MAX_HEALTH) * 100));
  }

  hit() {
    if (this.isDead) return;
    this.reduceHealth();
    this.playHurtEffects();
    this.checkIfDead();
  }

  reduceHealth() {
    this.health -= this.DAMAGE_AMOUNT;
    this.ensureHealthNotNegative();
  }

  ensureHealthNotNegative() {
    if (this.health < 0) this.health = 0;
  }

  playHurtEffects() {
    this.playHurtSound();
    this.playHurtAnimationIfAlive();
  }

  playHurtSound() {
    playEndbossHurtSound();
  }

  playHurtAnimationIfAlive() {
    if (this.health > 0) {
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  checkIfDead() {
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.playDeathEffects();
    this.stopMovement();
    this.scheduleRemoval();
  }

  playDeathEffects() {
    this.playDeathAnimation();
    this.playDeathSound();
  }

  playDeathAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  playDeathSound() {
    playEndbossHurtSound();
  }

  stopMovement() {
    if (this.hasActiveMovement()) {
      this.clearMovementInterval();
    }
  }

  hasActiveMovement() {
    return this._moveInterval !== null;
  }

  clearMovementInterval() {
    clearInterval(this._moveInterval);
    this._moveInterval = null;
  }

  scheduleRemoval() {
    setTimeout(() => this.removeFromWorld(), this.REMOVAL_DELAY);
  }

  attack() {
    playEndbossAttackSound();
  }

  removeFromWorld() {
    if (this.world?.level?.enemies) {
      this.world.level.enemies = this.world.level.enemies.filter(
        (e) => e !== this
      );
    }
  }

  isEnemyDead() {
    return this.health <= 0;
  }
}