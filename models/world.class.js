class World {
  character;
  enemies = level1.enemies;
  clouds = level1.clouds;
  level = level1;
  backgroundObjects = level1.backgroundObjects;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHeart;
  statusBarBottle;
  statusBarCoins;
  throwableObject = [];
  

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.keyboard = keyboard;
    this.character = new Character();
    this.statusBarHeart = new StatusBarHeart(this.character);
    this.statusBarBottle = new StatusBarBottle(this);
    this.statusBarCoins = new StatusBarCoins(this);
    this.draw();
    this.setWorld();
    this.run();
    this.spawnChickens();
  }

  setWorld() {
    this.character.world = this;  // give the charcater acces to the world
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 35 );
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.statusBarBottle.percentageBottle > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObject.push(bottle);
      this.statusBarBottle.setPercentageBottle(
        this.statusBarBottle.percentageBottle - 1
      );
    }
  }

  checkCharacterCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isDead()) {
        //eingefügt: && !this.character.isDead())
            if (this.character.isAboveGround() && this.character.speedY < 0) {  
               enemy.hit();  // Damage enemy (not character)
               this.character.jump();
            } else {
              this.character.hit();  // Character only gets hit if coming from the side
              if (this.character.health == 0) {
                 this.character.life --
              }
            }
        this.statusBarHeart.setPercentage(this.character.health);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.throwableObject);
    this.addToMap(this.character); 
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHeart);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoins);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  checkCollisions() {
    this.checkCharacterCollisions();
    this.checkBottleCollisions();
  }

  checkBottleCollisions() {
    this.throwableObject.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy, enemyIndex) => {
        if (bottle.isColliding(enemy) && enemy instanceof Chicken) {
          enemy.hit();
          bottle.splash();

          if (enemy.isEnemyDead()) {
            setTimeout(() => {
              enemy.removeFromWorld();
              this.level.enemies.splice(enemyIndex, 1);
            }, 1000);
            this.checkBottleSpawn();
          }
        }
      });

      if (bottle.y > 360) {
        bottle.splash();
      }
    });

    this.throwableObject = this.throwableObject.filter(
      (b) => !b.markedForRemoval
    );
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
  }

  addObjectsToMap(objects) {
    objects
      .filter((o) => !o.markedForRemoval)
      .forEach((o) => {
        this.addToMap(o);
      });
  }

  checkBottleSpawn() {
    if (this.level.enemies.length <= level1.enemies.length - 2) {
      this.StatusBarBottle.setPercentageBottle(10);
    }
  }

  spawnChickens() {
    setInterval(() => {
      if (this.level.enemies.length < 5) {
        let newChicken = new Chicken();
        newChicken.x = this.character.x + 800 + Math.random() * 300;
        this.level.enemies.push(newChicken);
      }
    }, 5000);
  }

  playGameSound(soundFilePath, volume = 0.2) {
    let gameSound = new Audio(soundFilePath);
    gameSound.volume = volume;
    gameSound.play();
}
}
