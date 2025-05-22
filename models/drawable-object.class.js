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
    this.img = this.createImage(path);
  }

  createImage(path) {
    const img = new Image();
    img.src = path;
    return img;
  }

  loadImages(paths) {
    paths.forEach(path => this.addImageToCache(path));
  }

  addImageToCache(path) {
    this.imageCache[path] = this.createImage(path);
    this.setImageStyle(this.imageCache[path]);
  }

  setImageStyle(img) {
    img.style = "transform: scaleX(-1)";
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character) this.drawCollisionRect(ctx);
  }

  drawCollisionRect(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.x + this.collisionOffsetLeft,
      this.y + this.collisionOffsetTop,
      this.width - this.collisionOffsetLeft - this.collisionOffsetRight,
      this.height - this.collisionOffsetTop - this.collisionOffsetBottom
    );
  }
}
