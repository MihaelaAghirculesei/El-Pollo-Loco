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
    this.statusBarBottle.percentageBottle = 0; 
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
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollection();
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
            if (this.character.isAboveGround() && this.character.speedY < 0) {  
               enemy.hit(); 
               this.character.jump();
               this.playGameSound('audio/chicken-hurt.mp3');
            } else {
              this.character.hit(); 
              this.playGameSound('audio/character-hurt-sound.mp3');
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
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottle);

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
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
  }

  checkBottleCollisions() {
    this.throwableObject.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && enemy instanceof Chicken) {
          enemy.hit();
          bottle.splash();

          if (enemy.isEnemyDead()) {
            setTimeout(() => {
              // enemy.removeFromWorld();
              this.level.enemies = this.level.enemies.filter(e => e !== enemy);
            }, 1000);
            this.checkBottleSpawn();
          }
        }
      });

      if (bottle.y > 360) {
        bottle.splash();
      }
    });
    this.throwableObject = this.throwableObject.filter((b) => !b.markedForRemoval);
  }

  addObjectsToMap(objects) {
    if (!objects || !Array.isArray(objects)) return; 
    objects
      .filter((o) => !o.markedForRemoval)
      .forEach((o) => {
        this.addToMap(o);
      });
  }

  checkBottleSpawn() {
    if (this.level.enemies.length <= level1.enemies.length - 2) {
      this.statusBarBottle.setPercentageBottle(10);
    }
  }

  spawnChickens() {
    setInterval(() => {
      if (this.level.enemies.length < 10) {
        let newChicken = new Chicken();
        newChicken.x = this.character.x + 800 + Math.random() * 300;
        newChicken.world = this;
        this.level.enemies.push(newChicken);
      }
    }, 5000);
  }

  playGameSound(soundFilePath, volume = 0.2) {
    let gameSound = new Audio(soundFilePath);
    gameSound.volume = volume;
    gameSound.play();
}

collectBottle() {
  this.statusBarBottle.setPercentageBottle(this.statusBarBottle.percentageBottle + 10); // Füge 10 oder eine andere Menge hinzu
  if (this.statusBarBottle.percentageBottle > 100) {
      this.statusBarBottle.percentageBottle = 100; 
  }
}

 checkCollection() {
    this.level.bottle.forEach((bottle, index) => { 
        if (this.character.isColliding(bottle) && !bottle.isCollected) {
            this.playGameSound('audio/bottle-collect-sound.mp3');
            this.collectBottle(); 
            bottle.isCollected = true; 
            muteSingleBottleSounds(bottle) 
            this.level.bottle.splice(index, 1);
        }
    });

    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin) && !coin.isCollected) {
          coin.collectItem();
          this.collectCoin();
          coin.isCollected = true; 
          this.level.coins.splice(index, 1); 
      }
  });
}

collectCoin() {
  this.statusBarCoins.setPercentageCoins(this.statusBarCoins.percentageCoins + 1);

  if (this.statusBarCoins.percentageCoins === 30) {
      this.showCongratulations();
      
      this.character.life++; 
  }
  
  if (this.statusBarCoins.percentageCoins > 100) {
      this.statusBarCoins.percentageCoins = 100; 
  }
}

removeCollectedBottles() {
  this.level.bottles = this.level.bottles.filter(bottle => !bottle.isCollected);
}

showCongratulations() {
  const popup = document.createElement("div");
  popup.classList.add("popup"); 
  popup.innerHTML = `
      <p>Congratulations! You've collected 30 Coins and earned a new life!</p>
      <button class="button-popup" onclick="this.parentElement.remove();">Close</button>
  `;

  document.body.appendChild(popup);

  const audio = new Audio('audio/new-life.mp3');
  audio.play();

  setTimeout(() => {
      document.body.removeChild(popup);
  }, 3000);
}

}
