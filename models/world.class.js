/**
 * Main game world class that manages all game objects, collisions, and game state
 */
export class World {
  /** @type {Character} The main player character */
  character;
  
  /** @type {Endboss} The end boss enemy */
  endboss;
  
  /** @type {Array} Array of enemy objects from level1 */
  enemies = level1.enemies;
  
  /** @type {Array} Array of cloud objects from level1 */
  clouds = level1.clouds;
  
  /** @type {Object} Current level object */
  level = level1;
  
  /** @type {Array} Array of background objects from level1 */
  backgroundObjects = level1.backgroundObjects;
  
  /** @type {HTMLCanvasElement} The game canvas element */
  canvas;
  
  /** @type {CanvasRenderingContext2D} The 2D rendering context */
  ctx;
  
  /** @type {Object} Keyboard input handler */
  keyboard;
  
  /** @type {number} Camera X position for scrolling */
  camera_x = 0;
  
  /** @type {StatusBarHeartCharacter} Status bar for character health */
  statusBarHeartCharacter;
  
  /** @type {StatusBarBottle} Status bar for bottles */
  statusBarBottle;
  
  /** @type {StatusBarCoins} Status bar for coins */
  statusBarCoins;
  
  /** @type {Array} Array of throwable objects (bottles) */
  throwableObject = [];
  
  /** @type {boolean} Game over state flag */
  gameOver = false;
  
  /** @type {number} Game loop interval ID */
  gameInterval;

  /**
   * Creates a new World instance
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {Object} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.character = new Character();
    this.endboss = new Endboss();
    this.endboss.world = this;
    this.level.enemies.push(this.endboss);
    this.initializeStatusBars();
    this.setWorld();
    this.spawnChickens();
    this.run();
    this.draw();
  }

  /**
   * Initializes all status bars
   */
  initializeStatusBars() {
    this.statusBarHeartCharacter = new StatusBarHeartCharacter(this.character);
    this.statusBarHeartEndboss = new StatusBarHeartEndboss(this.endboss);
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarBottle.setBottlesCount(0);
    this.statusBarCoins = new StatusBarCoins(this);
  }

  /**
   * Sets the world reference for the character
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the main game loop with collision detection and game state checks
   */
  run() {
    this.gameInterval = setInterval(() => {
      if (!this.gameOver) {
        this.checkBossActivation();
        if (isGameMuted && this.endbossAttackStarted) stopEndbossAttackMusic(this);
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkCollection();
        checkGameEnd(this);
      }
    }, 35);
  }

  /**
   * Checks if the character is close enough to activate the boss fight
   */
  checkBossActivation() {
    if (Math.abs(this.character.x - this.endboss.x) < 500) {
      this.endboss.startMoving();
      if (!this.endbossAttackStarted) {
        playEndbossAttackMusic(this);
        this.endbossAttackStarted = true;
      }
    }
  }

  /**
   * Main draw function that renders all game objects and UI elements
   */
  draw() {
    if (this.gameOver) return;
    clearCanvas(this.ctx, this.canvas);
    this.ctx.translate(this.camera_x, 0);
    this.drawAllGameObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.statusBarHeartEndboss.updateHealth();
    this.drawAllStatusBars();
    requestAnimationFrame(() => !this.gameOver && this.draw());
  }

  /**
   * Draws all game objects (background, clouds, enemies, collectibles, character)
   */
  drawAllGameObjects() {
    const objectArrays = [
      this.backgroundObjects, this.clouds, this.throwableObject,
      this.level.enemies, this.level.coins, this.level.bottle
    ];
    objectArrays.forEach(arr => {
      arr?.filter(o => !o.markedForRemoval).forEach(o => this.addToMap(o));
    });
    this.addToMap(this.character);
  }

  /**
   * Draws all status bars (health, bottles, coins)
   */
  drawAllStatusBars() {
    const statusBars = [
      this.statusBarHeartCharacter, this.statusBarBottle,
      this.statusBarCoins, this.statusBarHeartEndboss
    ];
    statusBars.forEach(bar => this.addToMap(bar));
  }

  /**
   * Starts animation for all chicken enemies
   */
  startEnemiesAnimation() {
    this.level.enemies.forEach(e => {
      if ((e instanceof Chicken || e instanceof SmallChicken) && typeof e.animate === "function") {
        e.animate();
      }
    });
  }

  /**
   * Handles throwing objects (bottles) when D key is pressed
   */
  checkThrowObjects() {
    if (this.keyboard.D && !this.keyboard.wasD && this.statusBarBottle.bottlesCount > 0) {
      const dir = this.character.otherDirection ? -1 : 1;
      this.throwableObject.push(new ThrowableObject(this.character.x + 10 * dir, this.character.y + 10, dir));
      this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount - 1);
    }
    this.keyboard.wasD = this.keyboard.D;
  }

  /**
   * Main collision detection function
   */
  checkCollisions() {
    this.checkCharacterCollisions();
    this.checkBottleCollisions();
    this.filterMarkedEnemies();
  }

/**
* Checks for collisions between character and enemies
* @returns {void}
*/
checkCharacterCollisions() {
 this.level.enemies.forEach(enemy => {
   if (isCollidingWithEnemy(this.character, enemy) && !this.character.isDead()) {
     this.handleCollisionResponse(enemy);
   }
 });
}

/**
* Handles the appropriate response based on collision type
* @param {Object} enemy - The enemy object that collided with the character
* @returns {void}
*/
handleCollisionResponse(enemy) {
 if ((enemy.constructor.name === 'Chicken' || enemy.constructor.name === 'SmallChicken') && isValidJump(this.character, enemy)) {
   this.handleJumpOnEnemy(enemy);
 } else {
   this.handleCollisionDamage(enemy);
 }
}

  /**
   * Handles successful jump attack on enemy
   * @param {Object} enemy - The enemy being attacked
   */
  handleJumpOnEnemy(enemy) {
    enemy.hit();
    this.character.jump();
    playEnemyHurtSound(enemy);
  }

  /**
   * Handles collision damage with per-enemy cooldown tracking
   * @param {Object} enemy - The enemy that caused the collision
   */
  handleCollisionDamage(enemy) {
    if (shouldApplyCollisionDamage(this.character, enemy)) {
      this.applyCollisionDamage();
    }
  }

/**
 * Applies damage to character when colliding with enemies
 * Updated to use getHealthPercent() method
 */
applyCollisionDamage() {
  this.character.hit();
  playCharacterHurtSound();
  
  const healthPercent = this.character.getHealthPercent();
  this.statusBarHeartCharacter.setPercentage(healthPercent);
}

  /**
   * Cleans up enemy hit tracking when enemies are removed
   */
  cleanupEnemyHitTracking() {
    this.character.hitByEnemies.forEach((timestamp, enemy) => {
      if (!this.level.enemies.includes(enemy)) {
        this.character.hitByEnemies.delete(enemy);
      }
    });
  }

  /**
   * Checks collisions between thrown bottles and enemies
   */
  checkBottleCollisions() {
    this.throwableObject.forEach(bottle => {
      if (bottle.y > 360) bottle.splash();
      this.level.enemies.forEach(enemy => {
        if (!bottle.isColliding(enemy)) return;
        this.handleEnemyHitByBottle(bottle, enemy);
      });
    });
    this.filterMarkedBottles();
  }

  /**
   * Handles when an enemy is hit by a bottle
   * @param {Object} bottle - The bottle object
   * @param {Object} enemy - The enemy object
   */
  handleEnemyHitByBottle(bottle, enemy) {
    enemy.hit();
    bottle.splash();
    playEnemyHurtSound(enemy);
    if (enemy instanceof Endboss && enemy.health <= 0) {
      enemy.die();
    } else if (enemy.isEnemyDead()) {
      requestAnimationFrame(() => {
        this.level.enemies = this.level.enemies.filter(e => e !== enemy);
      });
      this.checkBottleSpawn();
    }
  }

  /**
   * Removes enemies marked for removal from the game
   */
  filterMarkedEnemies() {
    this.level.enemies = filterMarkedObjects(this.level.enemies);
    this.cleanupEnemyHitTracking(); 
  }

  /**
   * Removes bottles marked for removal from the game
   */
  filterMarkedBottles() {
    this.throwableObject = filterMarkedObjects(this.throwableObject);
  }

  /**
   * Spawns bottles when enough enemies are defeated
   */
  checkBottleSpawn() {
    if (this.level.enemies.length <= level1.enemies.length - 2) {
      this.statusBarBottle.setPercentageBottle(20);
    }
  }

  /**
   * Spawns new chicken enemies periodically
   */
  spawnChickens() {
    setInterval(() => {
      if (this.level.enemies.length < 10) {
        const enemy = Math.random() < 0.5 ? new Chicken(this) : new SmallChicken(this);
        enemy.x = this.character.x + 800 + Math.random() * 300;
        enemy.world = this;
        enemy.animate();
        this.level.enemies.push(enemy);
      }
    }, 5000);
  }

  /**
   * Checks for collection of bottles and coins
   */
  checkCollection() {
    this.level.bottle = checkCollectible(
      this.character, 
      this.level.bottle, 
      () => this.collectBottle(), 
      playBottleCollectSound
    );
    
    this.level.coins = checkCollectible(
      this.character, 
      this.level.coins, 
      () => this.collectCoin(), 
      playCoinCollectSound
    );
  }

  /**
   * Handles bottle collection
   */
  collectBottle() {
    this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount + 1);
  }

  /**
   * Handles coin collection and life rewards
   */
  collectCoin() {
    const coins = ++this.statusBarCoins.percentageCoins;
    this.statusBarCoins.setPercentageCoins(coins >= 30 ? 0 : coins);
    if (coins === 30) {
      this.character.life++;
      showCongratulations(this.canvas);
    }
    if (coins > 100) this.statusBarCoins.percentageCoins = 100;
  }

  /**
   * Adds a movable object to the canvas map with proper flipping for direction
   * @param {Object} mo - The movable object to add
   */
  addToMap(mo) {
    if (mo.otherDirection) flipImage(this.ctx, mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) flipImageBack(this.ctx, mo);
  }
}