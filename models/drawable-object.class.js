class DrawableObject {
  constructor() {
    this.initPosition();
    this.initDimensions();
    this.initImageProperties();
    this.initCollisionOffsets();
    this.initImageCache();
  }

  initPosition() {
    this.x = 120;
    this.y = 250;
  }

  initDimensions() {
    this.height = 200;
    this.width = 100;
  }

  initImageProperties() {
    this.img = null;
    this.currentImage = 0;
  }

  initCollisionOffsets() {
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
    paths.forEach(path => this.cacheImage(path));
  }

  cacheImage(path) {
    const img = this.createImage(path);
    this.applyImageFlip(img);
    this.imageCache[path] = img;
  }

  applyImageFlip(img) {
    img.style.transform = "scaleX(-1)";
  }

  draw(ctx) {
    if (!this.hasImage()) return;
    this.renderImage(ctx);
  }

  hasImage() {
    return this.img !== null;
  }

  renderImage(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (!this.isCharacter()) return;
    this.renderCollisionBox(ctx);
  }

  isCharacter() {
    return this instanceof Character;
  }

  renderCollisionBox(ctx) {
    ctx.beginPath();
    this.drawCollisionPath(ctx);
  }

  drawCollisionPath(ctx) {
    const box = this.getCollisionBox();
    ctx.rect(box.x, box.y, box.width, box.height);
  }

  getCollisionBox() {
    return {
      x: this.getCollisionX(),
      y: this.getCollisionY(), 
      width: this.getCollisionWidth(),
      height: this.getCollisionHeight()
    };
  }

  getCollisionX() {
    return this.x + this.collisionOffsetLeft;
  }

  getCollisionY() {
    return this.y + this.collisionOffsetTop;
  }

  getCollisionWidth() {
    return this.width - this.collisionOffsetLeft - this.collisionOffsetRight;
  }

  getCollisionHeight() {
    return this.height - this.collisionOffsetTop - this.collisionOffsetBottom;
  }
}