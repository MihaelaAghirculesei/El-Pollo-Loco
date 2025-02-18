class World {
  character = new Character();
  enemies = [
    new Chicken(), 
    new Chicken(), 
    new Chicken(),
  ];
  clouds = [
    new Cloud()
  ];
  keyboard = new Keyboard();
  backgroundObjekts = [
    new BackgroundObjekt('img_pollo_locco/img/5_background/layers/air.png', 0,),
    new BackgroundObjekt('img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0,),
    new BackgroundObjekt('img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObjekt('img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0), 
];
  canvas;
  ctx;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d'); 
    this.character.world = this;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addObjectsToMap(this.backgroundObjekts);
    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
   


    // Draw wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function() {
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
      this.ctx.save();
      this.ctx.translate(mo.img.width / 2,0);
      this.ctx.scale(-1,1);

    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      this.ctx.restore();

    }
  }
}


