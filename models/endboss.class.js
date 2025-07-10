/**
 * Endboss enemy character with complex behavior patterns.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  MAX_HEALTH = 200;
  DAMAGE_AMOUNT = 1;
  DISTANCE_TO_KEEP = 0;
  ANIMATION_SPEED = 150;
  REMOVAL_DELAY = 1000;

  IMAGES_WALKING = [
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png",
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
  IMAGES_ATTACK = [
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /** Creates Endboss */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.initializeStats();
    this.initializeState();
  }

  /** Loads all images */
  loadAllImages() {
    this.loadImages([...this.IMAGES_WALKING, ...this.IMAGES_HURT, ...this.IMAGES_STAY, ...this.IMAGES_ATTACK, ...this.IMAGES_DEAD]);
  }

  /** Sets stats */
  initializeStats() {
    this.height = 400;
    this.width = 250;
    this.y = 60;
    this.x = 4000;
    this.health = this.MAX_HEALTH;
    this.speed = 10;
    this.isDead = false;
  }

  /** Sets state */
  initializeState() {
    this.walking = true;
    this._isMoving = false;
    this._moveInterval = null;
    this.currentState = 'walking';
    this.stateTimer = 0;
    this.alertSoundPlayed = false;
    this.sequenceComplete = false;
    this._isJumping = false;
    this.groundLevel = 60;
  }

  /** Starts movement */
  startMoving() {
    if (!this._isMoving) {
      this._isMoving = true;
      this.animate();
    }
  }

  /** Starts animation */
  animate() {
    if (this._moveInterval) return;
    this._moveInterval = setInterval(() => this.executeMovementCycle(), this.ANIMATION_SPEED);
  }

  /** Executes cycle */
  executeMovementCycle() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    this.updateAnimationCycle();
    this.move();
    this.playCurrentStateAnimation();
  }

  /** Updates cycle */
  updateAnimationCycle() {
    if (this.sequenceComplete) {
      this.handlePostSequenceState();
      return;
    }
    this.handleInitialSequence();
  }

  /** Handles post sequence */
  handlePostSequenceState() {
    if (this.isCharacterNear() && !this._isJumping) {
      this.currentState = 'attack';
      this.stateTimer = 0;
    } else if (this.currentState === 'attack' && this.stateTimer >= 6) {
      this.currentState = 'walking';
      this.stateTimer = 0;
    } else {
      this.currentState = 'walking';
    }
  }

  /** Handles sequence */
  handleInitialSequence() {
    this.stateTimer++;
    this.checkStateTransition();
  }

  /** Checks transition */
  checkStateTransition() {
    const transitions = { walking: 6, alert: 8, attack: 6 };
    const nextStates = { walking: 'alert', alert: 'attack', attack: 'walking' };
    
    if (this.stateTimer >= transitions[this.currentState]) {
      this.transitionToNextState(nextStates[this.currentState]);
    }
  }

  /** @param {string} nextState Transitions state */
  transitionToNextState(nextState) {
    if (this.currentState === 'attack') this.sequenceComplete = true;
    this.currentState = nextState;
    this.stateTimer = 0;
  }

  /** @returns {boolean} Checks proximity */
  isCharacterNear() {
    return this.hasValidCharacter() && Math.abs(this.x - this.getCharacterPosition()) < 60;
  }

  /** Plays animations */
  playCurrentStateAnimation() {
    const animations = {
      walking: () => this.playAnimation(this.IMAGES_WALKING),
      alert: () => this.handleAlertState(),
      attack: () => this.handleAttackState()
    };
    animations[this.currentState]?.();
  }

  /** Handles alert */
  handleAlertState() {
    this.playAnimation(this.IMAGES_STAY);
    if (this.stateTimer === 1 && !this.alertSoundPlayed) {
      this.playAlertSound();
      this.alertSoundPlayed = true;
    }
  }

  /** Handles attack */
  handleAttackState() {
    this.playAnimation(this.IMAGES_ATTACK);
    if (this.stateTimer === 3) {
      if (this.sequenceComplete) {
        this.performAttackJump();
        this.attack();
      }
    }
  }

  /** Moves boss */
  move() {
    if (!this.hasValidCharacter() || this.currentState !== 'walking' || this._isJumping) return;
    const characterX = this.getCharacterPosition();
    this.adjustPosition(characterX, this.DISTANCE_TO_KEEP);
  }

  /** Performs jump */
  performAttackJump() {
    if (!this.canPerformJump()) return;
    this.executeJump();
  }

  /** @returns {boolean} Can jump */
  canPerformJump() {
    return this.hasValidCharacter() && Math.abs(this.x - this.world.character.x) < 80;
  }

  /** Executes jump */
  executeJump() {
    if (this._isJumping) return;
    this._isJumping = true;
    const jumpDistance = 120;
    const characterX = this.world.character.x;
    this.x += this.x < characterX ? jumpDistance : -jumpDistance;
    this.performJumpAnimation();
  }

  /** Jump animation */
  performJumpAnimation() {
    this.y = 30;
    setTimeout(() => {
      this.y = 60;
      this._isJumping = false;
    }, 300);
  }

  /** Plays alert sound */
  playAlertSound() {
    if (this.world && !this.world.endbossAttackStarted && !this.alertSoundPlayed) {
      playEndbossAttackMusic(this.world);
      this.world.endbossAttackStarted = true;
    }
  }

  /** @returns {number} Character X */
  getCharacterPosition() {
    return this.world.character.x;
  }

  /** @returns {boolean} Has character */
  hasValidCharacter() {
    return this.world?.character;
  }

  /** @param {number} characterX @param {number} distanceToKeep Adjusts position */
  adjustPosition(characterX, distanceToKeep) {
    if (this.x < characterX - distanceToKeep) this.moveRight();
    else if (this.x > characterX + distanceToKeep) this.moveLeft();
  }

  /** Moves right */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  /** Moves left */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  /** @returns {number} Health percent */
  getHealthPercent() {
    return Math.max(0, Math.round((this.health / this.MAX_HEALTH) * 100));
  }

  /** Takes damage */
  hit() {
    if (this.isDead) return;
    this.health = Math.max(0, this.health - this.DAMAGE_AMOUNT);
    playEndbossHurtSound();
    if (this.health > 0) this.playAnimation(this.IMAGES_HURT);
    if (this.health <= 0) this.die();
  }

  /** Handles death */
  die() {
    this.isDead = true;
    this.currentState = 'dead';
    this.playDeathEffects();
    this.stopMovement();
    this.scheduleRemoval();
  }

  /** Death effects */
  playDeathEffects() {
    this.playAnimation(this.IMAGES_DEAD);
    playEndbossHurtSound();
    if (this.world) stopEndbossAttackMusic(this.world);
  }

  /** Stops movement */
  stopMovement() {
    if (this._moveInterval) {
      clearInterval(this._moveInterval);
      this._moveInterval = null;
    }
  }

  /** Schedules removal */
  scheduleRemoval() {
    setTimeout(() => this.removeFromWorld(), 2000);
  }

  /** Attack sound */
  attack() {
    playEndbossAttackSound();
  }

  /** Removes from world */
  removeFromWorld() {
    if (this.world?.level?.enemies) {
      this.world.level.enemies = this.world.level.enemies.filter(e => e !== this);
    }
  }

  /** @returns {boolean} Is dead */
  isEnemyDead() {
    return this.health <= 0;
  }
}