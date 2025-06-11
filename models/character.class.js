class Character extends MovableObject {
  static CONFIG = {
    HEIGHT: 240, Y_POSITION: 80, SPEED: 10, INITIAL_HEALTH: 100,
    INITIAL_LIFE: 2, JUMP_SPEED: 30, CAMERA_OFFSET: 300,
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

  constructor() {
    super();
    this.setInitialValues();
    this.loadCharacterImages();
    this.prepareCharacter();
  }

  setInitialValues() {
    const cfg = Character.CONFIG;
    this.height = cfg.HEIGHT;
    this.y = cfg.Y_POSITION;
    this.speed = cfg.SPEED;
    this.health = cfg.INITIAL_HEALTH;
    this.life = cfg.INITIAL_LIFE;
    this.lastActionTime = Date.now() - cfg.INITIAL_LAST_ACTION_OFFSET;
    this.currentState = Character.STATES.SLEEPING;
  }

  loadCharacterImages() {
    this.IMAGES_IDLE = this.createImageArray('IDLE');
    this.IMAGES_SLEEPING = this.createImageArray('SLEEPING');
    this.IMAGES_WALKING = this.createImageArray('WALKING');
    this.IMAGES_JUMPING = this.createImageArray('JUMPING');
    this.IMAGES_HURT = this.createImageArray('HURT');
    this.IMAGES_DEAD = this.createImageArray('DEAD');
  }

  createImageArray(type) {
    const { path, start, count } = Character.IMAGE_PATHS[type];
    const base = Character.IMAGE_PATHS.BASE_PATH;
    return Array.from({ length: count }, (_, i) => `${base}/${path}${start + i}.png`);
  }

  prepareCharacter() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadAllCharacterImages();
    this.applyGravity();
    this.startAnimationLoops();
  }

  loadAllCharacterImages() {
    const all = [
      this.IMAGES_WALKING, this.IMAGES_JUMPING,
      this.IMAGES_DEAD, this.IMAGES_HURT,
      this.IMAGES_IDLE, this.IMAGES_SLEEPING
    ];
    all.forEach(arr => this.loadImages(arr));
  }

  startAnimationLoops() {
    this.startMovementLoop();
    this.startStateLoop();
    this.startAnimationLoop();
  }

  startMovementLoop() {
    setInterval(() => {
      this.processInput();
      this.updateCameraPosition();
    }, Character.CONFIG.FRAME_RATE);
  }

  processInput() {
    const { RIGHT, LEFT, SPACE } = this.world.keyboard;
    if (RIGHT) this.moveRightward();
    if (LEFT) this.moveLeftward();
    if (SPACE) this.tryToJump();
  }

  moveRightward() {
    this.moveRight();
    this.otherDirection = false;
    this.updateLastActionTime();
  }

  moveLeftward() {
    if (this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.updateLastActionTime();
    }
  }

  tryToJump() {
    if (!this.isAboveGround()) {
      this.jump();
      this.updateLastActionTime();
    }
  }

  updateCameraPosition() {
    this.world.camera_x = -this.x + Character.CONFIG.CAMERA_OFFSET;
  }

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

  determineState() {
    if (this.endbossDead()) return Character.STATES.ACTIVE;
    if (this.isDead()) return this.currentState;
    return this.stateByInactivity();
  }

  stateByInactivity() {
    const time = Date.now() - this.lastActionTime;
    if (time > Character.CONFIG.SLEEP_TIMEOUT) return Character.STATES.SLEEPING;
    if (time > Character.CONFIG.IDLE_TIMEOUT) return Character.STATES.IDLE;
    return Character.STATES.ACTIVE;
  }

  respondToStateChange() {
    if (this.currentState === Character.STATES.SLEEPING) playCharacterSnoringSound();
    else stopCharacterSnoringSound();
  }

  startAnimationLoop() {
    setInterval(() => this.playAnimationByState(), Character.CONFIG.ANIMATION_SPEED);
  }

  playAnimationByState() {
    if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
    if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
    if (this.currentState === Character.STATES.SLEEPING) return this.playAnimation(this.IMAGES_SLEEPING);
    if (this.currentState === Character.STATES.IDLE) return this.playAnimation(this.IMAGES_IDLE);
    if (this.isAboveGround()) return this.playAnimation(this.IMAGES_JUMPING);
    if (this.isMoving()) return this.playAnimation(this.IMAGES_WALKING);
  }

  isMoving() {
    const { RIGHT, LEFT } = this.world.keyboard;
    return RIGHT || LEFT;
  }

  updateLastActionTime() {
    this.lastActionTime = Date.now();
  }

  jump() {
    this.speedY = Character.CONFIG.JUMP_SPEED;
  }

  endbossDead() {
    const endboss = this.world.enemies.find(e => e instanceof Endboss);
    if (!endboss) {
      console.warn('Endboss not found in enemies array.');
      return false;
    }
    return endboss.isEnemyDead();
  }
}
