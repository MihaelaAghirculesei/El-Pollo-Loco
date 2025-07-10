/**
 * Endboss enemy character with complex behavior patterns.
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

  /**
   * Creates Endboss instance.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.initializeStats();
    this.initializeState();
  }

  /**
   * Loads all endboss images.
   */
  loadAllImages() {
    this.loadImages([...this.IMAGES_WALKING, ...this.IMAGES_HURT, ...this.IMAGES_STAY, ...this.IMAGES_ATTACK, ...this.IMAGES_DEAD]);
  }

  /**
   * Sets endboss stats.
   */
  initializeStats() {
    this.height = 400;
    this.width = 250;
    this.y = 60;
    this.x = 4000;
    this.health = this.MAX_HEALTH;
    this.speed = 10;
    this.isDead = false;
  }

  /**
   * Sets endboss state properties.
   */
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

  /**
   * Starts endboss movement.
   */
  startMoving() {
    if (!this._isMoving) {
      this._isMoving = true;
      this.animate();
    }
  }

  /**
   * Starts animation loop.
   */
  animate() {
    if (this._moveInterval) return;
    this._moveInterval = setInterval(() => this.executeMovementCycle(), this.ANIMATION_SPEED);
  }

  /**
   * Executes movement cycle.
   */
  executeMovementCycle() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    this.updateAnimationCycle();
    this.move();
    this.playCurrentStateAnimation();
  }

  /**
   * Updates animation cycle.
   */
  updateAnimationCycle() {
    if (this.sequenceComplete) {
      this.handlePostSequenceState();
      return;
    }
    this.handleInitialSequence();
  }

  /**
   * Handles post-sequence state logic.
   */
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

  /**
   * Handles initial sequence logic.
   */
  handleInitialSequence() {
    this.stateTimer++;
    this.checkStateTransition();
  }

  /**
   * Checks and executes state transitions.
   */
  checkStateTransition() {
    const transitions = { walking: 6, alert: 8, attack: 6 };
    const nextStates = { walking: 'alert', alert: 'attack', attack: 'walking' };
    
    if (this.stateTimer >= transitions[this.currentState]) {
      this.transitionToNextState(nextStates[this.currentState]);
    }
  }

  /**
   * Transitions to next state.
   * @param {string} nextState - Next state to transition to
   */
  transitionToNextState(nextState) {
    if (this.currentState === 'attack') this.sequenceComplete = true;
    this.currentState = nextState;
    this.stateTimer = 0;
  }

  /**
   * Checks if character is near endboss.
   * @returns {boolean} True if character is near
   */
  isCharacterNear() {
    return this.hasValidCharacter() && Math.abs(this.x - this.getCharacterPosition()) < 60;
  }

  /**
   * Plays animations based on current state.
   */
  playCurrentStateAnimation() {
    const animations = {
      walking: () => this.playAnimation(this.IMAGES_WALKING),
      alert: () => this.handleAlertState(),
      attack: () => this.handleAttackState()
    };
    animations[this.currentState]?.();
  }

  /**
   * Handles alert state logic.
   */
  handleAlertState() {
    this.playAnimation(this.IMAGES_STAY);
    if (this.stateTimer === 1 && !this.alertSoundPlayed) {
      this.playAlertSound();
      this.alertSoundPlayed = true;
    }
  }

  /**
   * Handles attack state logic.
   */
  handleAttackState() {
    this.playAnimation(this.IMAGES_ATTACK);
    if (this.stateTimer === 3) {
      if (this.sequenceComplete) {
        this.performAttackJump();
        this.attack();
      }
    }
  }

  /**
   * Moves endboss towards character.
   */
  move() {
    if (!this.hasValidCharacter() || this.currentState !== 'walking' || this._isJumping) return;
    const characterX = this.getCharacterPosition();
    this.adjustPosition(characterX, this.DISTANCE_TO_KEEP);
  }

  /**
   * Performs attack jump if conditions met.
   */
  performAttackJump() {
    if (!this.canPerformJump()) return;
    this.executeJump();
  }

  /**
   * Checks if jump can be performed.
   * @returns {boolean} True if jump can be performed
   */
  canPerformJump() {
    return this.hasValidCharacter() && Math.abs(this.x - this.world.character.x) < 80;
  }

  /**
   * Executes jump attack.
   */
  executeJump() {
    if (this._isJumping) return;
    this._isJumping = true;
    const jumpDistance = 120;
    const characterX = this.world.character.x;
    this.x += this.x < characterX ? jumpDistance : -jumpDistance;
    this.performJumpAnimation();
  }

  /**
   * Performs jump animation.
   */
  performJumpAnimation() {
    this.y = 30;
    setTimeout(() => {
      this.y = 60;
      this._isJumping = false;
    }, 300);
  }

  /**
   * Plays alert sound.
   */
  playAlertSound() {
    if (this.world && !this.world.endbossAttackStarted && !this.alertSoundPlayed) {
      playEndbossAttackMusic(this.world);
      this.world.endbossAttackStarted = true;
    }
  }

  /**
   * Gets character X position.
   */
  getCharacterPosition() {
    return this.world.character.x;
  }

  /**
   * Checks if valid character exists.
   */
  hasValidCharacter() {
    return this.world?.character;
  }

  /**
   * Adjusts endboss position relative to character.
   */
  adjustPosition(characterX, distanceToKeep) {
    if (this.x < characterX - distanceToKeep) this.moveRight();
    else if (this.x > characterX + distanceToKeep) this.moveLeft();
  }

  /**
   * Moves endboss right.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  /**
   * Moves endboss left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  /**
   * Gets health as percentage.
   */
  getHealthPercent() {
    return Math.max(0, Math.round((this.health / this.MAX_HEALTH) * 100));
  }

  /**
   * Handles endboss taking damage.
   */
  hit() {
    if (this.isDead) return;
    this.health = Math.max(0, this.health - this.DAMAGE_AMOUNT);
    playEndbossHurtSound();
    if (this.health > 0) this.playAnimation(this.IMAGES_HURT);
    if (this.health <= 0) this.die();
  }

  /**
   * Handles endboss death.
   */
  die() {
    this.isDead = true;
    this.currentState = 'dead';
    this.playDeathEffects();
    this.stopMovement();
    this.scheduleRemoval();
  }

  /**
   * Plays death effects.
   */
  playDeathEffects() {
    this.playAnimation(this.IMAGES_DEAD);
    playEndbossHurtSound();
    if (this.world) stopEndbossAttackMusic(this.world);
  }

  /**
   * Stops all movement.
   */
  stopMovement() {
    if (this._moveInterval) {
      clearInterval(this._moveInterval);
      this._moveInterval = null;
    }
  }

  /**
   * Schedules removal from world.
   */
  scheduleRemoval() {
    setTimeout(() => this.removeFromWorld(), 2000);
  }

  /**
   * Plays attack sound.
   */
  attack() {
    playEndbossAttackSound();
  }

  /**
   * Removes endboss from world.
   */
  removeFromWorld() {
    if (this.world?.level?.enemies) {
      this.world.level.enemies = this.world.level.enemies.filter(e => e !== this);
    }
  }

  /**
   * Checks if endboss is dead.
   */
  isEnemyDead() {
    return this.health <= 0;
  }
}