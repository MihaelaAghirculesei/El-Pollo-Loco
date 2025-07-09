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
   * Initializes the character with default values and prepares animations.
   */
  constructor() {
    super();
    this.setInitialValues();
    this.loadCharacterImages();
    this.prepareCharacter();
  }

  /**
   * Sets initial values like position, speed, health, and state.
   */
  setInitialValues() {
    const cfg = Character.CONFIG;
    this.height = cfg.HEIGHT;
    this.y = cfg.Y_POSITION;
    this.speed = cfg.SPEED;
    this.health = cfg.INITIAL_HEALTH;
    this.life = cfg.INITIAL_LIFE;
    this.lastActionTime = Date.now() - cfg.INITIAL_LAST_ACTION_OFFSET;
    this.hitByEnemies = new Map(); // Usa Map per salvare timestamp dei danni per nemico
    this.lastGlobalHitTime = 0; // AGGIUNTO: Cooldown globale per polli/galline
    this.currentState = Character.STATES.SLEEPING;
  }

  /**
   * Loads image paths for different animation states of the character.
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
   * Creates an array of image paths for a specific animation type.
   * @param {string} type - The type of animation.
   * @returns {string[]} Array of image paths.
   */
  createImageArray(type) {
    const { path, start, count } = Character.IMAGE_PATHS[type];
    const base = Character.IMAGE_PATHS.BASE_PATH;
    return Array.from({ length: count }, (_, i) => `${base}/${path}${start + i}.png`);
  }

  /**
   * Prepares the character by loading images, applying gravity, and starting animation loops.
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
    const all = [
      this.IMAGES_WALKING, this.IMAGES_JUMPING,
      this.IMAGES_DEAD, this.IMAGES_HURT,
      this.IMAGES_IDLE, this.IMAGES_SLEEPING
    ];
    all.forEach(arr => this.loadImages(arr));
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
   * Starts a loop that processes input and updates the camera position.
   */
  startMovementLoop() {
    setInterval(() => {
      this.processInput();
      this.updateCameraPosition();
    }, Character.CONFIG.FRAME_RATE);
  }

  /**
   * Processes keyboard input and triggers corresponding movements.
   */
  processInput() {
    const { RIGHT, LEFT, SPACE } = this.world.keyboard;
    if (RIGHT) this.moveRightward();
    if (LEFT) this.moveLeftward();
    if (SPACE) this.tryToJump();
  }

  /**
   * Moves the character to the right and updates the last action time.
   */
  moveRightward() {
    this.moveRight();
    this.otherDirection = false;
    this.updateLastActionTime();
  }

  /**
   * Moves the character to the left (if possible) and updates the last action time.
   */
  moveLeftward() {
    if (this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.updateLastActionTime();
    }
  }

  /**
   * Attempts to make the character jump if not already in the air, and updates last action time.
   */
  tryToJump() {
    if (!this.isAboveGround()) {
      this.jump();
      this.updateLastActionTime();
    }
  }

  /**
   * Updates the camera position based on the character's position.
   */
  updateCameraPosition() {
    this.world.camera_x = -this.x + Character.CONFIG.CAMERA_OFFSET;
  }

  /**
   * Starts a loop that checks the character's state and reacts on state changes.
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
   * Determines the character's current state based on death, endboss status, and inactivity.
   * @returns {string} Current state.
   */
  determineState() {
    if (this.endbossDead()) return Character.STATES.ACTIVE;
    if (this.isDead()) return this.currentState;
    return this.stateByInactivity();
  }

  /**
   * Determines the state based on inactivity time.
   * @returns {string} State according to inactivity duration.
   */
  stateByInactivity() {
    const time = Date.now() - this.lastActionTime;
    if (time > Character.CONFIG.SLEEP_TIMEOUT) return Character.STATES.SLEEPING;
    if (time > Character.CONFIG.IDLE_TIMEOUT) return Character.STATES.IDLE;
    return Character.STATES.ACTIVE;
  }

  /**
   * Reacts to a state change, e.g. playing or stopping snoring sounds.
   */
  respondToStateChange() {
    if (this.currentState === Character.STATES.SLEEPING) playCharacterSnoringSound();
    else stopCharacterSnoringSound();
  }

  /**
   * Starts a loop that plays animations according to the current state.
   */
  startAnimationLoop() {
    setInterval(() => this.playAnimationByState(), Character.CONFIG.ANIMATION_SPEED);
  }

  /**
   * Plays the animation that corresponds to the current state.
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
   * Checks if the character is currently moving.
   * @returns {boolean} True if moving, false otherwise.
   */
  isMoving() {
    const { RIGHT, LEFT } = this.world.keyboard;
    return RIGHT || LEFT;
  }

  /**
   * Updates the timestamp of the character's last action.
   */
  updateLastActionTime() {
    this.lastActionTime = Date.now();
  }

  /**
   * Makes the character jump by setting vertical speed.
   */
  jump() {
    this.speedY = Character.CONFIG.JUMP_SPEED;
  }

  /**
   * Handles the character getting hit: updates hit state and health.
   * MODIFICA: Overrides parent method to use 20 damage instead of 10
   */
  hit() {
    this.updateHitState();
    this.health -= 20; // MODIFICA: 20 punti di danno (20%) invece di 10
    this.handleHealthDepletion();
  }

  /**
   * Updates the time of the last hit to current time.
   */
  updateHitState() {
    this.lastHitTime = Date.now();
  }

  /**
   * Checks health and handles respawn or death if health reaches zero.
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
   * Checks if the character has remaining lives.
   * @returns {boolean}
   */
  hasLivesLeft() {
    return this.life > 0;
  }

  /**
   * Respawns the character by resetting health and reducing life count.
   */
  respawn() {
    this.health = 100; // MODIFICA: Ripristina salute a 100
    this.life--;
  }

  /**
   * Marks the character as dead.
   */
  die() {
    this.lastHitTime = Date.now();
  }

  /**
   * Calculates the character's health as a percentage.
   * AGGIUNTO: Nuovo metodo per calcolare percentuale salute
   */
  getHealthPercent() {
    return Math.max(0, Math.round((this.health / 100) * 100));
  }

  /**
   * Checks if the character is dead (no lives left).
   * @returns {boolean}
   */
  isDead() {
    return this.life <= 0;
  }

  /**
   * Checks if the endboss is dead.
   * @returns {boolean} True if endboss is dead, false otherwise.
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