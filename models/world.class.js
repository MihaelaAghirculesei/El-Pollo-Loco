class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  level = level1;
  backgroundObjekts = level1.backgroundObjects;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  StatusBarBottle = new StatusBarBottle();
  ThrowableObjecet = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
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

  checkThrowObjects(){
    if(this.keyboard.D) {
      let bottle = new ThrowableObjecet(this.character.x + 100, this.character.y + 100);
      this.ThrowableObjecet.push(bottle);
    }
  }

  checkCollisions() {
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
    this.addObjectsToMap(this.backgroundObjekts);
    this.addObjectsToMap(this.ThrowableObjecet);
   // this.ctx.translate(this.camera_x, 0);
     this.addToMap(this.statusBar);
     this.addToMap(this.StatusBarBottle);
      // --------Space fof Fixed objects------------------
    //this.ctx.translate(this.camera_x, 0); // Forwards

    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);

    this.ctx.translate(-this.camera_x, 0);

    // this.checkCollisions(); () // in piu

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach(o => {
      this.addToMap(o);
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

}
