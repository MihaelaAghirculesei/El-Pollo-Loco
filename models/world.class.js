import { checkGameEnd } from "./game-utils.js";

export class World {
  character; endboss; enemies = level1.enemies; clouds = level1.clouds; level = level1;
  backgroundObjects = level1.backgroundObjects; canvas; ctx; keyboard; camera_x = 0;
  statusBarHeartCharacter; statusBarBottle; statusBarCoins; throwableObject = [];
  gameOver = false; gameInterval; currentSounds = {};

constructor(c, k) {
    this.canvas = c; 
    this.ctx = c.getContext("2d"); 
    this.keyboard = k;
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

  setWorld = () => (this.character.world = this);

  run = () => this.gameInterval = setInterval(() => {
    if (!this.gameOver) {
          if (Math.abs(this.character.x - this.endboss.x) < 500) {
              this.endboss.startMoving();
              if (!this.endbossAttackStarted) {
                this.playEndbossAttackMusic();
                this.endbossAttackStarted = true;
              }
            }
            if (isGameMuted && this.endbossAttackStarted) {
              stopEndbossAttackMusic(this);
            }
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollection();
      checkGameEnd(this);
    }
  }, 35);

  draw = () => {
    if (this.gameOver) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    [this.backgroundObjects, this.clouds, this.throwableObject, this.level.enemies, this.level.coins, this.level.bottle]
      .forEach(arr => arr?.filter(o => !o.markedForRemoval).forEach(o => this.addToMap(o)));
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this.statusBarHeartEndboss.updateHealth();
    [this.statusBarHeartCharacter, this.statusBarBottle, this.statusBarCoins, this.statusBarHeartEndboss].forEach(bar => this.addToMap(bar));
    if (!this.gameOver) requestAnimationFrame(this.draw);
  };

startEnemiesAnimation() {
  this.level.enemies.forEach(e => {
    if ((e instanceof Chicken || e instanceof SmallChicken) && typeof e.animate === "function") {
      e.animate();
    }
  });
}

  checkThrowObjects = () => {
   if (this.keyboard.D && this.statusBarBottle.bottlesCount > 0) {
    let direction = this.character.otherDirection ? -1 : 1;
         this.throwableObject.push(
        new ThrowableObject(
          this.character.x + 10* direction,
          this.character.y + 10,
          direction
        )
      );     
    this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount - 1);
    }
  };

 checkCharacterCollisions = () => {
  let jumpedOnEnemy = false; 
  this.level.enemies.forEach(e => {
    if (this.character.isColliding(e) && !this.character.isDead()) {
      if (!jumpedOnEnemy && this.character.isAboveGround() && this.character.speedY <= 0) {
        e.hit();
        this.character.jump();
        jumpedOnEnemy = true; 
        if (!isGameMuted) playSound(`audio/${e instanceof SmallChicken ? "small-chicken-hurt" : "chicken-hurt"}.mp3`);
      } else if (!jumpedOnEnemy) { 
        this.character.hit();
        if (!isGameMuted) playSound("audio/character-hurt-sound.mp3");
        if (this.character.health === 0) this.character.life--;
        this.statusBarHeartCharacter.setPercentage(this.character.health);
      }
    }
  });
};

  addToMap = mo => {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx); mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  };

  flipImage = mo => {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  };

  flipImageBack = mo => {
    mo.x *= -1;
    this.ctx.restore();
  };

  checkCollisions = () => {
    this.checkCharacterCollisions();
    this.checkBottleCollisions();
    this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);
  };

  checkBottleCollisions = () => {
    this.throwableObject.forEach(bottle => {
      if (bottle.y > 360) bottle.splash();
      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          enemy.hit(); bottle.splash();
          if (enemy instanceof Endboss && enemy.health <= 0) enemy.die();
          else if (enemy.isEnemyDead()) {
            setTimeout(() => this.level.enemies = this.level.enemies.filter(e => e !== enemy), 1000);
            this.checkBottleSpawn();
          }
          if (!isGameMuted) playSound(enemy instanceof SmallChicken ? "audio/small-chicken-hurt.mp3" : "audio/chicken-hurt.mp3");
        }
      });
    });
    this.throwableObject = this.throwableObject.filter(b => !b.markedForRemoval);
  };

  checkBottleSpawn = () => {
    if (this.level.enemies.length <= level1.enemies.length - 2) this.statusBarBottle.setPercentageBottle(20);
  };

  spawnChickens = () => setInterval(() => {
    if (this.level.enemies.length < 10) {
      const enemy = Math.random() < 0.5 ? new Chicken(this) : new SmallChicken(this);
      enemy.x = this.character.x + 800 + Math.random() * 300;
      enemy.world = this;
      enemy.animate();
      this.level.enemies.push(enemy);
    }
  }, 5000);

  playSound = (path, vol = 0.2) => {
    if (this.currentSounds[path]) return;
    const s = new Audio(path);
    s.volume = vol;
    s.play();
    this.currentSounds[path] = s;
    s.onended = () => delete this.currentSounds[path];
  };

 collectBottle = () => {
  this.statusBarBottle.setBottlesCount(this.statusBarBottle.bottlesCount + 1);
};

  checkCollection = () => {
    const check = (arr, fn) => arr.forEach((item, i) => {
      if (this.character.isColliding(item) && !item.isCollected) {
        if (!isGameMuted && item.collect_sound) item.collect_sound.play();
        fn.call(this);
        item.isCollected = true;
        arr.splice(i, 1);
      }
    });
    check(this.level.bottle, this.collectBottle);
    check(this.level.coins, this.collectCoin);
  };

  collectCoin = () => {
    this.statusBarCoins.setPercentageCoins(this.statusBarCoins.percentageCoins + 1);
    this.statusBarCoins.percentageCoins++;
    if (this.statusBarCoins.percentageCoins === 30) {
      this.showCongratulations();
      this.character.life++;
      this.statusBarCoins.setPercentageCoins(0);
    }
    if (this.statusBarCoins.percentageCoins > 100) this.statusBarCoins.percentageCoins = 100;
  };

playEndbossAttackMusic() {
  if (this.endbossAttackMusic || isGameMuted) return;
  this.endbossAttackMusic = new Audio("audio/endboss-atack.mp3");
  this.endbossAttackMusic.loop = true;
  this.endbossAttackMusic.volume = 0.5;
  this.endbossAttackMusic.play();
}

  showCongratulations = () => {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
      <p>Congratulations! You've collected 30 Coins and earned a new life!</p>
      <button class="button-popup" onclick="this.parentElement.remove()">Close</button>
    `;
    document.body.appendChild(popup);
     if (!isGameMuted) {
    new Audio("audio/new-life.mp3").play();
     }
    setTimeout(() => popup.remove(), 1000);
  };
}
