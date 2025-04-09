class DrawableObject {
  x = 120;
  y = 250;
  height = 200;
  width = 100;
  img;
  imageCache = {};
  currentImage = 0;

  collisionOffsetTop = 80;     
  collisionOffsetBottom = 5;  
  collisionOffsetLeft = 10;    
  collisionOffsetRight = 10;
  
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }


  drawFrame(ctx) {
    if (this instanceof Character) {
      ctx.beginPath();
      ctx.rect(
        this.x + this.collisionOffsetLeft,
        this.y + this.collisionOffsetTop,
        this.width - this.collisionOffsetLeft - this.collisionOffsetRight,
        this.height - this.collisionOffsetTop - this.collisionOffsetBottom
      );

     // ctx.stroke();
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      img.style = "transform: scalX (-1)";
      this.imageCache[path] = img;
    });
  }
}
