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

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.character = new Character();
    this.endboss = new Endboss();
    this.endboss.world = this;
    this.level.enemies.push(this.endboss);
    this.endbossAttackMusic = null;
    this.endbossAttackStarted = false;
    this.statusBarHeartEndboss = new StatusBarHeartEndboss(this.endboss);
    this.statusBarHeartCharacter = new StatusBarHeartCharacter(this.character);
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarBottle.setBottlesCount(0);
    this.statusBarCoins = new StatusBarCoins(this);
    this.draw();
    this.setWorld();
    this.run();
    this.spawnChickens();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    this.gameInterval = setInterval(() => {
      if (!this.gameOver) {
        this.checkBossActivation();
        if (isGameMuted && this.endbossAttackStarted) {
          stopEndbossAttackMusic(this);
        }
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkCollection();
        checkGameEnd(this);
      }
    }, 35);
  }

  checkBossActivation() {
    if (Math.abs(this.character.x - this.endboss.x) < 500) {
      this.endboss.startMoving();
      if (!this.endbossAttackStarted) {
        playEndbossAttackMusic(this);
        this.endbossAttackStarted = true;
      }
    }
  }

  draw() {
    if (this.gameOver) return;
    this.clearCanvas();
    this.ctx.translate(this.camera_x, 0);
    this.drawAllGameObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.statusBarHeartEndboss.updateHealth();
    this.drawAllStatusBars();
    if (!this.gameOver) requestAnimationFrame(this.draw.bind(this));
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawAllGameObjects() {
    [
      this.backgroundObjects,
      this.clouds,
      this.throwableObject,
      this.level.enemies,
      this.level.coins,
      this.level.bottle,
    ].forEach((arr) =>
      arr?.filter((o) => !o.markedForRemoval).forEach((o) => this.addToMap(o))
    );
    this.addToMap(this.character);
  }

  drawAllStatusBars() {
    [
      this.statusBarHeartCharacter,
      this.statusBarBottle,
      this.statusBarCoins,
      this.statusBarHeartEndboss,
    ].forEach((bar) => this.addToMap(bar));
  }

  startEnemiesAnimation() {
    this.level.enemies.forEach((e) => {
      if (
        (e instanceof Chicken || e instanceof SmallChicken) &&
        typeof e.animate === "function"
      ) {
        e.animate();
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.statusBarBottle.bottlesCount > 0) {
      let direction = this.character.otherDirection ? -1 : 1;
      this.throwableObject.push(
        new ThrowableObject(
          this.character.x + 10 * direction,
          this.character.y + 10,
          direction
        )
      );
      this.statusBarBottle.setBottlesCount(
        this.statusBarBottle.bottlesCount - 1
      );
    }
  }

  checkCharacterCollisions() {
    let jumpedOnEnemy = false;
    this.level.enemies.forEach((e) => {
      if (this.character.isColliding(e) && !this.character.isDead()) {
        if (
          !jumpedOnEnemy &&
          this.character.isAboveGround() &&
          this.character.speedY <= 0
        ) {
          e.hit();
          this.character.jump();
          jumpedOnEnemy = true;
          playEnemyHurtSound(e);
        } else if (!jumpedOnEnemy) {
          this.character.hit();
          playCharacterHurtSound();
          if (this.character.health === 0) this.character.life--;
          this.statusBarHeartCharacter.setPercentage(this.character.health);
        }
      }
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }

  checkCollisions() {
    this.check1CharacterCollisions();
    this.checkBottleCollisions();
    this.filterMarkedEnemies();
  }

  check1CharacterCollisions() {
    this.checkCharacterCollisions();
  }

  checkBottleCollisions() {
    this.throwableObject.forEach((bottle) => {
      if (bottle.y > 360) bottle.splash();
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          enemy.hit();
          bottle.splash();
          if (enemy instanceof Endboss && enemy.health <= 0) enemy.die();
          else if (enemy.isEnemyDead()) {
            requestAnimationFrame(() => {
              this.level.enemies = this.level.enemies.filter(e => e !== enemy);
            });
            this.checkBottleSpawn();
          }
          playEnemyHurtSound(enemy);
        }
      });
    });
    this.filterMarkedBottles();
  }

  filterMarkedEnemies() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
  }

  filterMarkedBottles() {
    this.throwableObject = this.throwableObject.filter((b) => !b.markedForRemoval);
  }

  checkBottleSpawn() {
    if (this.level.enemies.length <= level1.enemies.length - 2)
      this.statusBarBottle.setPercentageBottle(20);
  }

  spawnChickens() {
    setInterval(() => {
      if (this.level.enemies.length < 10) {
        const enemy =
          Math.random() < 0.5 ? new Chicken(this) : new SmallChicken(this);
        enemy.x = this.character.x + 800 + Math.random() * 300;
        enemy.world = this;
        enemy.animate();
        this.level.enemies.push(enemy);
      }
    }, 5000);
  }

  collectBottle() {
    this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount + 1);
  }

  checkCollection() {
    this.checkCollectible(this.level.bottle, this.collectBottle, playBottleCollectSound);
    this.checkCollectible(this.level.coins, this.collectCoin, playCoinCollectSound);
  }

  checkCollectible(arr, collectFn, soundFn) {
    arr.forEach((item, i) => {
      if (this.character.isColliding(item) && !item.isCollected) {
        soundFn(); 
        collectFn.call(this);
        item.isCollected = true;
        arr.splice(i, 1);
      }
    });
  }

  collectCoin() {
    this.statusBarCoins.setPercentageCoins(this.statusBarCoins.percentageCoins + 1);
    this.statusBarCoins.percentageCoins++;
    if (this.statusBarCoins.percentageCoins === 30) {
      this.showCongratulations();
      this.character.life++;
      this.statusBarCoins.setPercentageCoins(0);
    }
    if (this.statusBarCoins.percentageCoins > 100)
      this.statusBarCoins.percentageCoins = 100;
  }

  showCongratulations() {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
      <p>Congratulations! You've collected 30 Coins and earned a new life!</p>
      <button class="button-popup" onclick="this.parentElement.remove(); document.getElementById('content').style.pointerEvents='none'">Close</button>
    `;
    const contentContainer = document.getElementById('content') || document.body;
    contentContainer.appendChild(popup);
    contentContainer.style.pointerEvents = 'auto';
    playNewLifeSound();
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (popup.parentNode) {
          popup.remove();
          contentContainer.style.pointerEvents = 'none';
        }
      }, 2000);
    });
  }
}
