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
  backgroundObjekts = [
    new BackgroundObjekt('img_pollo_locco/img/5_background/layers/1_first_layer/1.png')
];
  canvas;
  ctx;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d'); // Zugriff auf das Canvas-Rendering-Context
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.backgroundObjekts);


    // draw wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach(cloud => {
      this.addToMap(cloud);
});

  }

  addToMap(mo) {
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }
}


