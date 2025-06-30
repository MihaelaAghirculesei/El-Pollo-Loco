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
    this.statusBarHeartCharacter = new StatusBarHeartCharacter(this.character);
    this.statusBarHeartEndboss = new StatusBarHeartEndboss(this.endboss);
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarBottle.setBottlesCount(0);
    this.statusBarCoins = new StatusBarCoins(this);
    this.setWorld();
    this.spawnChickens();
    this.run();
    this.draw();
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
    this.clearCanvas();
    this.ctx.translate(this.camera_x, 0);
    this.drawAllGameObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.statusBarHeartEndboss.updateHealth();
    this.drawAllStatusBars();
    requestAnimationFrame(() => !this.gameOver && this.draw());
  }

  /**
   * Clears the entire canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws all game objects (background, clouds, enemies, collectibles, character)
   */
  drawAllGameObjects() {
    [this.backgroundObjects, this.clouds, this.throwableObject, this.level.enemies, this.level.coins, this.level.bottle]
      .forEach(arr => arr?.filter(o => !o.markedForRemoval).forEach(o => this.addToMap(o)));
    this.addToMap(this.character);
  }

  /**
   * Draws all status bars (health, bottles, coins)
   */
  drawAllStatusBars() {
    [this.statusBarHeartCharacter, this.statusBarBottle, this.statusBarCoins, this.statusBarHeartEndboss]
      .forEach(bar => this.addToMap(bar));
  }

  /**
   * Starts animation for all chicken enemies
   */
  startEnemiesAnimation() {
    this.level.enemies.forEach(e => {
      if ((e instanceof Chicken || e instanceof SmallChicken) && typeof e.animate === "function") e.animate();
    });
  }

  /**
   * Handles throwing objects (bottles) when D key is pressed
   */
  checkThrowObjects() {
    if (this.keyboard.D && this.statusBarBottle.bottlesCount > 0) {
      const dir = this.character.otherDirection ? -1 : 1;
      this.throwableObject.push(new ThrowableObject(this.character.x + 10 * dir, this.character.y + 10, dir));
      this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount - 1);
    }
  }

  /**
   * Checks collisions between character and enemies
   */
  checkCharacterCollisions() {
    let jumped = false;
    this.level.enemies.forEach(e => {
      if (!this.character.isColliding(e) || this.character.isDead()) return;
      jumped
        ? this.applyCollisionDamage()
        : this.handleEnemyJumpCollision(e, () => jumped = true);
    });
  }

  /**
   * Handles collision when character jumps on enemy
   * @param {Object} enemy - The enemy object
   * @param {Function} setJumped - Callback to set jumped state
   */
  handleEnemyJumpCollision(enemy, setJumped) {
    if (this.character.isAboveGround() && this.character.speedY <= 0) {
      enemy.hit();
      this.character.jump();
      playEnemyHurtSound(enemy);
      setJumped();
    } else this.applyCollisionDamage();
  }

  /**
   * Applies damage to character when colliding with enemies
   */
  applyCollisionDamage() {
    this.character.hit();
    playCharacterHurtSound();
    if (this.character.health === 0) this.character.life--;
    this.statusBarHeartCharacter.setPercentage(this.character.health);
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
    if (enemy instanceof Endboss && enemy.health <= 0) enemy.die();
    else if (enemy.isEnemyDead()) {
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
    this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);
  }

  /**
   * Removes bottles marked for removal from the game
   */
  filterMarkedBottles() {
    this.throwableObject = this.throwableObject.filter(b => !b.markedForRemoval);
  }

  /**
   * Spawns bottles when enough enemies are defeated
   */
  checkBottleSpawn() {
    if (this.level.enemies.length <= level1.enemies.length - 2)
      this.statusBarBottle.setPercentageBottle(20);
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
    this.checkCollectible(this.level.bottle, this.collectBottle, playBottleCollectSound);
    this.checkCollectible(this.level.coins, this.collectCoin, playCoinCollectSound);
  }

 /**
 * Check collision with collectible items
 * @param {Array} arr - Array of collectible items
 * @param {Function} collectFn - Function to call when item is collected
 * @param {Function} soundFn - Function to play sound on collection
 */
checkCollectible(arr, collectFn, soundFn) {
  arr.forEach((item, i) => {
    if (this.isCollidingWithItem(item) && !item.isCollected) {
      soundFn();
      collectFn.call(this);
      item.isCollected = true;
      arr.splice(i, 1);
    }
  });
}

/**
 * Check if character is colliding with a specific item
 * @param {Object} item - The collectible item to check collision with
 * @returns {boolean} True if collision detected, false otherwise
 */
isCollidingWithItem(item) {
  const charBounds = this.getCharacterBounds();
  const itemBounds = this.getItemBounds(item);
  
  return charBounds.right > itemBounds.left && 
         charBounds.left < itemBounds.right && 
         charBounds.bottom > itemBounds.top && 
         charBounds.top < itemBounds.bottom;
}

/**
 * Get character collision boundaries with margins
 * @returns {Object} Character bounds with left, right, top, bottom properties
 */
getCharacterBounds() {
  const margin = 30;
  return {
    left: this.character.x + margin,
    right: this.character.x + this.character.width - margin,
    top: this.character.y + margin,
    bottom: this.character.y + this.character.height - margin
  };
}

/**
 * Get item collision boundaries with appropriate margins
 * @param {Object} item - The collectible item
 * @returns {Object} Item bounds with left, right, top, bottom properties
 */
getItemBounds(item) {
  const isCoin = item.constructor.name === 'Coin' || item.height > 100;
  const margin = isCoin ? 40 : 10;
  
  return {
    left: item.x + margin,
    right: item.x + item.width - margin,
    top: item.y + margin,
    bottom: item.y + item.height - margin
  };
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
      this.showCongratulations();
    }
    if (coins > 100) this.statusBarCoins.percentageCoins = 100;
  }

  /**
   * Shows congratulations popup when player earns a new life
   */
  showCongratulations() {
    const popup = this.createPopupElement();
    this.positionPopup(popup);
    document.body.appendChild(popup);
    playNewLifeSound();
    setTimeout(() => popup.remove(), 2000);
  }

  /**
   * Creates the congratulations popup DOM element
   * @returns {HTMLElement} The popup element
   */
  createPopupElement() {
    const div = document.createElement("div");
    div.className = "popup";
    div.innerHTML = `
      <p>Congratulations! You've collected 30 Coins and earned a new life!</p>
      <button class="button-popup" onclick="this.parentElement.remove()">Close</button>
    `;
    return div;
  }

  /**
   * Positions the popup relative to the canvas
   * @param {HTMLElement} popup - The popup element to position
   */
  positionPopup(popup) {
    const { right, top } = this.canvas.getBoundingClientRect();
    Object.assign(popup.style, {
      left: `${right + 17}px`,
      top: `${top - 7}px`
    });
  }

  /**
   * Adds a movable object to the canvas map with proper flipping for direction
   * @param {Object} mo - The movable object to add
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips an image horizontally for rendering in opposite direction
   * @param {Object} mo - The movable object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /**
   * Restores image to original orientation after flipping
   * @param {Object} mo - The movable object to restore
   */
  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }
}