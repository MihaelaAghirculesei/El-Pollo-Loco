/**
 * Main game world class managing all game objects and state.
 */
export class World {
  character;
  endboss;
  enemies = level1.enemies;
  clouds = level1.clouds;
  level = level1;
  backgroundObjects = level1.backgroundObjects;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHeartCharacter;
  statusBarBottle;
  statusBarCoins;
  throwableObject = [];
  gameOver = false;
  gameInterval;

  /**
   * Creates new World instance.
   * @param {HTMLCanvasElement} canvas - Game canvas
   * @param {Object} keyboard - Keyboard input handler
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
   * Initializes all status bars.
   */
  initializeStatusBars() {
    this.statusBarHeartCharacter = new StatusBarHeartCharacter(this.character);
    this.statusBarHeartEndboss = new StatusBarHeartEndboss(this.endboss);
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarBottle.setBottlesCount(0);
    this.statusBarCoins = new StatusBarCoins(this);
  }

  /**
   * Sets world reference for character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts main game loop.
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
   * Checks if character activates boss fight.
   */
  checkBossActivation() {
    if (this.endboss._isMoving) {
      return; 
    }
    if (Math.abs(this.character.x - this.endboss.x) < 500) {
      this.endboss.startMoving();
      if (!this.endbossAttackStarted) {
        playEndbossAttackMusic(this);
        this.endbossAttackStarted = true;
      }
    }
  }

  /**
   * Main draw function rendering all game objects.
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
   * Draws all game objects to canvas.
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
   * Draws all status bars to canvas.
   */
  drawAllStatusBars() {
    const statusBars = [
      this.statusBarHeartCharacter, this.statusBarBottle,
      this.statusBarCoins, this.statusBarHeartEndboss
    ];
    statusBars.forEach(bar => this.addToMap(bar));
  }

  /**
   * Starts animation for all chicken enemies.
   */
  startEnemiesAnimation() {
    this.level.enemies.forEach(e => {
      if ((e instanceof Chicken || e instanceof SmallChicken) && typeof e.animate === "function") {
        e.animate();
      }
    });
  }

  /**
   * Handles throwing objects when D key pressed.
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
   * Main collision detection function.
   */
  checkCollisions() {
    this.checkCharacterCollisions();
    this.checkBottleCollisions();
    this.filterMarkedEnemies();
  }

  /**
   * Checks collisions between character and enemies.
   */
  checkCharacterCollisions() {
    this.level.enemies.forEach(enemy => {
      if (isCollidingWithEnemy(this.character, enemy) && !this.character.isDead()) {
        if (this.character.lastJumpKillTime && Date.now() - this.character.lastJumpKillTime < 500) {
          if (enemy instanceof Endboss) {
            return;
          }
        }
        this.handleCollisionResponse(enemy);
      }
    });
  }

  /**
   * Handles appropriate collision response.
   * @param {Object} enemy - Enemy that collided
   */
  handleCollisionResponse(enemy) {
    if ((enemy.constructor.name === 'Chicken' || enemy.constructor.name === 'SmallChicken') && isValidJump(this.character, enemy)) {
      this.handleJumpOnEnemy(enemy);
    } else {
      this.handleCollisionDamage(enemy);
    }
    
    if (enemy instanceof Endboss) {
      this.handleCollisionDamage(enemy);
      return;
    }

    if (this.character.lastJumpKillTime && (Date.now() - this.character.lastJumpKillTime < 500)) {
      return; 
    }
    
    if (this.endbossAttackStarted && this.character.lastDirectionChangeTime && 
      (Date.now() - this.character.lastDirectionChangeTime) < 300) {
      return;
    }
    
    const nearEndboss = this.level.enemies.some(e => e instanceof Endboss && Math.abs(this.character.x - e.x) < 200);
    if (nearEndboss && (enemy.constructor.name === 'Chicken' || enemy.constructor.name === 'SmallChicken') && 
        isValidJump(this.character, enemy)) {
      this.handleJumpOnEnemy(enemy);
      return;
    }
  }

  /**
   * Handles successful jump attack on enemy.
   * @param {Object} enemy - Enemy being attacked
   */
  handleJumpOnEnemy(enemy) {
    enemy.hit();
    this.character.jump();
    this.character.lastJumpKillTime = Date.now();
    playEnemyHurtSound(enemy);
  }

  /**
   * Handles collision damage with cooldown tracking.
   * @param {Object} enemy - Enemy causing damage
   */
  handleCollisionDamage(enemy) {
    if (shouldApplyCollisionDamage(this.character, enemy)) {
      this.applyCollisionDamage();
    }
  }

  /**
   * Applies damage to character from collision.
   */
  applyCollisionDamage() {
    this.character.hit();
    playCharacterHurtSound();
    
    const healthPercent = this.character.getHealthPercent();
    this.statusBarHeartCharacter.setPercentage(healthPercent);
  }

  /**
   * Cleans up enemy hit tracking for removed enemies.
   */
  cleanupEnemyHitTracking() {
    this.character.hitByEnemies.forEach((timestamp, enemy) => {
      if (!this.level.enemies.includes(enemy)) {
        this.character.hitByEnemies.delete(enemy);
      }
    });
  }

  /**
   * Checks collisions between bottles and enemies.
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
   * Handles enemy being hit by bottle.
   * @param {Object} bottle - Bottle object
   * @param {Object} enemy - Enemy object
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
   * Removes enemies marked for removal.
   */
  filterMarkedEnemies() {
    this.level.enemies = filterMarkedObjects(this.level.enemies);
    this.cleanupEnemyHitTracking(); 
  }

  /**
   * Removes bottles marked for removal.
   */
  filterMarkedBottles() {
    this.throwableObject = filterMarkedObjects(this.throwableObject);
  }

  /**
   * Spawns bottles when enemies defeated.
   */
  checkBottleSpawn() {
    if (this.level.enemies.length <= level1.enemies.length - 2) {
      this.statusBarBottle.setPercentageBottle(20);
    }
  }

  /**
   * Spawns new chicken enemies periodically.
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
   * Checks for collection of bottles and coins.
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
   * Handles bottle collection.
   */
  collectBottle() {
    this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount + 1);
  }

  /**
   * Handles coin collection and life rewards.
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
   * Adds movable object to canvas with direction flipping.
   * @param {Object} mo - Movable object to add
   */
  addToMap(mo) {
    if (mo.otherDirection) flipImage(this.ctx, mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) flipImageBack(this.ctx, mo);
  }
}