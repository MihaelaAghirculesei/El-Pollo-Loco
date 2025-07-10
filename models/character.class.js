/**
 * Represents a game character with movement, animation, and state management.
 */
class Character extends MovableObject {
  static CONFIG = {
    HEIGHT: 240, Y_POSITION: 80, SPEED: 5, INITIAL_HEALTH: 100,
    INITIAL_LIFE: 1, JUMP_SPEED: 30, CAMERA_OFFSET: 300,
    FRAME_RATE: 1000 / 60, ANIMATION_SPEED: 50,
    STATE_CHECK_INTERVAL: 100, IDLE_TIMEOUT: 3000,
    SLEEP_TIMEOUT: 6000, INITIAL_LAST_ACTION_OFFSET: 6000
  };

  static IMAGE_PATHS = {
    BASE_PATH: 'img_pollo_locco/img/2_character_pepe',
    IDLE: { path: '1_idle/idle/I-', start: 1, count: 10 },
    SLEEPING: { path: '1_idle/long_idle/I-', start: 11, count: 10 },
    WALKING: { path: '2_walk/W-', start: 21, count: 6 },
    JUMPING: { path: '3_jump/J-', start: 31, count: 9 },
    HURT: { path: '4_hurt/H-', start: 41, count: 3 },
    DEAD: { path: '5_dead/D-', start: 51, count: 7 }
  };

  static STATES = { ACTIVE: 'active', IDLE: 'idle', SLEEPING: 'sleeping' };

  /**
   * Initializes the character with default values.
   */
  constructor() {
    super();
    this.setInitialValues();
    this.loadCharacterImages();
    this.prepareCharacter();
  }

  /**
   * Sets initial character properties.
   */
  setInitialValues() {
    const cfg = Character.CONFIG;
    this.height = cfg.HEIGHT;
    this.y = cfg.Y_POSITION;
    this.speed = cfg.SPEED;
    this.health = cfg.INITIAL_HEALTH;
    this.life = cfg.INITIAL_LIFE;
    this.lastActionTime = Date.now() - cfg.INITIAL_LAST_ACTION_OFFSET;
    this.hitByEnemies = new Map(); 
    this.lastGlobalHitTime = 0; 
    this.currentState = Character.STATES.SLEEPING;
    this.lastJumpKillTime = 0; 
    this.lastDirectionChangeTime = 0; 
  }

  /**
   * Loads all character animation images.
   */
  loadCharacterImages() {
    this.IMAGES_IDLE = this.createImageArray('IDLE');
    this.IMAGES_SLEEPING = this.createImageArray('SLEEPING');
    this.IMAGES_WALKING = this.createImageArray('WALKING');
    this.IMAGES_JUMPING = this.createImageArray('JUMPING');
    this.IMAGES_HURT = this.createImageArray('HURT');
    this.IMAGES_DEAD = this.createImageArray('DEAD');
  }

  /**
   * Creates image array for specific animation type.
   * @param {string} type - Animation type
   * @returns {string[]} Array of image paths
   */
  createImageArray(type) {
    const { path, start, count } = Character.IMAGE_PATHS[type];
    const base = Character.IMAGE_PATHS.BASE_PATH;
    return Array.from({ length: count }, (_, i) => `${base}/${path}${start + i}.png`);
  }

  /**
   * Prepares character for gameplay.
   */
  prepareCharacter() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadAllCharacterImages();
    this.applyGravity();
    this.startAnimationLoops();
  }

  /**
   * Loads all character images into memory.
   */
  loadAllCharacterImages() {
    const imageArrays = [
      this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_DEAD, 
      this.IMAGES_HURT, this.IMAGES_IDLE, this.IMAGES_SLEEPING
    ];
    imageArrays.forEach(arr => this.loadImages(arr));
  }

  /**
   * Starts all recurring animation and movement loops.
   */
  startAnimationLoops() {
    this.startMovementLoop();
    this.startStateLoop();
    this.startAnimationLoop();
  }

  /**
   * Starts movement processing loop.
   */
  startMovementLoop() {
    setInterval(() => {
      this.processInput();
      this.updateCameraPosition();
    }, Character.CONFIG.FRAME_RATE);
  }

  /**
   * Processes keyboard input for movement.
   */
  processInput() {
    const { RIGHT, LEFT, SPACE } = this.world.keyboard;
    if (RIGHT) this.moveRightward();
    if (LEFT) this.moveLeftward();
    if (SPACE) this.tryToJump();
  }

  /**
   * Moves character to the right.
   */
  moveRightward() {
    if (this.otherDirection === true) {
      this.lastDirectionChangeTime = Date.now();
    }
    this.moveRight();
    this.otherDirection = false;
    this.updateLastActionTime();
  }

  /**
   * Moves character to the left if possible.
   */
  moveLeftward() {
    if (this.x > 0) {
      if (this.otherDirection === false) {
        this.lastDirectionChangeTime = Date.now();
      }
      this.moveLeft();
      this.otherDirection = true;
      this.updateLastActionTime();
    }
  }

  /**
   * Attempts to make character jump.
   */
  tryToJump() {
    if (!this.isAboveGround()) {
      this.jump();
      this.updateLastActionTime();
    }
  }

  /**
   * Updates camera position based on character position.
   */
  updateCameraPosition() {
    this.world.camera_x = -this.x + Character.CONFIG.CAMERA_OFFSET;
  }

  /**
   * Starts state checking loop.
   */
  startStateLoop() {
    setInterval(() => {
      const newState = this.determineState();
      if (newState !== this.currentState) {
        this.currentState = newState;
        this.respondToStateChange();
      }
      if (this.endbossDead()) stopCharacterSnoringSound();
    }, Character.CONFIG.STATE_CHECK_INTERVAL);
  }

  /**
   * Determines current character state.
   * @returns {string} Current state
   */
  determineState() {
    if (this.endbossDead()) return Character.STATES.ACTIVE;
    if (this.isDead()) return this.currentState;
    return this.stateByInactivity();
  }

  /**
   * Gets state based on inactivity time.
   * @returns {string} State according to inactivity
   */
  stateByInactivity() {
    const time = Date.now() - this.lastActionTime;
    if (time > Character.CONFIG.SLEEP_TIMEOUT) return Character.STATES.SLEEPING;
    if (time > Character.CONFIG.IDLE_TIMEOUT) return Character.STATES.IDLE;
    return Character.STATES.ACTIVE;
  }

  /**
   * Responds to state changes with sound effects.
   */
  respondToStateChange() {
    if (this.currentState === Character.STATES.SLEEPING) playCharacterSnoringSound();
    else stopCharacterSnoringSound();
  }

  /**
   * Starts animation loop for state-based animations.
   */
  startAnimationLoop() {
    setInterval(() => this.playAnimationByState(), Character.CONFIG.ANIMATION_SPEED);
  }

  /**
   * Plays animation based on current state.
   */
  playAnimationByState() {
    if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
    if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
    if (this.currentState === Character.STATES.SLEEPING) return this.playAnimation(this.IMAGES_SLEEPING);
    if (this.currentState === Character.STATES.IDLE) return this.playAnimation(this.IMAGES_IDLE);
    if (this.isAboveGround()) return this.playAnimation(this.IMAGES_JUMPING);
    if (this.isMoving()) return this.playAnimation(this.IMAGES_WALKING);
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Checks if character is currently moving.
   * @returns {boolean} True if moving
   */
  isMoving() {
    const { RIGHT, LEFT } = this.world.keyboard;
    return RIGHT || LEFT;
  }

  /**
   * Updates timestamp of last action.
   */
  updateLastActionTime() {
    this.lastActionTime = Date.now();
  }

  /**
   * Makes character jump by setting vertical speed.
   */
  jump() {
    this.speedY = Character.CONFIG.JUMP_SPEED;
  }

  /**
   * Handles character getting hit.
   */
  hit() {
    this.updateHitState();
    this.health -= 20;
    this.handleHealthDepletion();
  }

  /**
   * Updates hit state timestamp.
   */
  updateHitState() {
    this.lastHitTime = Date.now();
  }

  /**
   * Handles health depletion and respawn/death.
   */
  handleHealthDepletion() {
    if (this.health <= 0) {
      this.health = 0;
      if (this.hasLivesLeft()) {
        this.respawn();
      } else {
        this.die();
      }
    }
  }

  /**
   * Checks if character has remaining lives.
   * @returns {boolean} True if lives left
   */
  hasLivesLeft() {
    return this.life > 0;
  }

  /**
   * Respawns character with full health.
   */
  respawn() {
    this.health = 100;
    this.life--;
  }

  /**
   * Marks character as dead.
   */
  die() {
    this.lastHitTime = Date.now();
  }

  /**
   * Gets character health as percentage.
   * @returns {number} Health percentage
   */
  getHealthPercent() {
    return Math.max(0, Math.round((this.health / 100) * 100));
  }

  /**
   * Checks if character is dead.
   * @returns {boolean} True if dead
   */
  isDead() {
    return this.life <= 0;
  }

  /**
   * Checks if endboss is dead.
   * @returns {boolean} True if endboss is dead
   */
  endbossDead() {
    const endboss = this.world.enemies.find(e => e instanceof Endboss);
    if (!endboss) {
      console.warn('Endboss not found in enemies array.');
      return false;
    }
    return endboss.isEnemyDead();
  }
}