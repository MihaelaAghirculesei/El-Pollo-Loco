class DrawableObject {
  constructor() {
    this.initProperties();
    this.initImageCache();
  }

  initProperties() {
    this.x = 120;
    this.y = 250;
    this.height = 200;
    this.width = 100;
    this.img;
    this.currentImage = 0;
    this.collisionOffsetTop = 80;
    this.collisionOffsetBottom = 5;
    this.collisionOffsetLeft = 10;
    this.collisionOffsetRight = 10;
  }

  initImageCache() {
    this.imageCache = {};
  }

  loadImage(path) {
    this.img = this.createImage(path);
  }

  createImage(path) {
    const img = new Image();
    img.src = path;
    return img;
  }

  loadImages(paths) {
    paths.forEach((path) => this.addImageToCache(path));
  }

  addImageToCache(path) {
    this.imageCache[path] = this.createImage(path);
    this.setImageStyle(this.imageCache[path]);
  }

  setImageStyle(img) {
    img.style.transform = "scaleX(-1)";
  }

  draw(ctx) {
    if (!this.img) return;
    this.drawImageToCanvas(ctx);
  }

  drawImageToCanvas(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character) {
      this.drawCollisionRect(ctx);
    }
  }

  drawCollisionRect(ctx) {
    ctx.beginPath();
    this.drawCollisionRectPath(ctx);
  }

  drawCollisionRectPath(ctx) {
    const x = this.x + this.collisionOffsetLeft;
    const y = this.y + this.collisionOffsetTop;
    const width = this.width - this.collisionOffsetLeft - this.collisionOffsetRight;
    const height = this.height - this.collisionOffsetTop - this.collisionOffsetBottom;
    ctx.rect(x, y, width, height);
  }
}
