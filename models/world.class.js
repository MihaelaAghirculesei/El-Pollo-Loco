class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  level = level1;
  backgroundObjects = level1.backgroundObjects;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  StatusBarBottle = new StatusBarBottle();
  ThrowableObject  = [];
  StatusBarCoins = new StatusBarCoins();

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => { 
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.StatusBarBottle.percentageBottle > 0) {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        this.ThrowableObject.push(bottle);
        this.StatusBarBottle.setPercentageBottle(this.StatusBarBottle.percentageBottle - 1);
    }
}

checkCharacterCollisions() {
    this.level.enemies.forEach((enemy) => {
      if(this.character.isColliding(enemy)&& !this.character.isDead()) {  //eingefügt: && !this.character.isDead())
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.ThrowableObject);
     this.addToMap(this.statusBar);
     this.addToMap(this.StatusBarBottle);
     this.addToMap(this.StatusBarCoins);


    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);

    this.ctx.translate(-this.camera_x, 0);

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

flipImage(mo){
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
  this.ThrowableObject.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy, enemyIndex) => {
          if (bottle.isColliding(enemy)) {
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

  this.ThrowableObject = this.ThrowableObject.filter(b => !b.markedForRemoval);
  this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);
}

addObjectsToMap(objects) {
  objects.filter(o => !o.markedForRemoval).forEach(o => {
      this.addToMap(o);
  });
}

checkBottleSpawn() {
  if (this.level.enemies.length <= (level1.enemies.length - 2)) {
      this.StatusBarBottle.setPercentageBottle(10);
  }
}
}
