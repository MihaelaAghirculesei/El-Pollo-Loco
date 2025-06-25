class DrawableObject {
  /**
   * Creates an instance of DrawableObject and initializes its properties.
   */
  constructor() {
    this.initPosition();
    this.initDimensions();
    this.initImageProperties();
    this.initCollisionOffsets();
    this.initImageCache();
  }

  /**
   * Initializes the position coordinates.
   */
  initPosition() {
    this.x = 120;
    this.y = 250;
  }

  /**
   * Initializes the dimensions of the object.
   */
  initDimensions() {
    this.height = 200;
    this.width = 100;
  }

  /**
   * Initializes image related properties.
   */
  initImageProperties() {
    this.img = null;
    this.currentImage = 0;
  }

  /**
   * Initializes collision offset values.
   */
  initCollisionOffsets() {
    this.collisionOffsetTop = 80;
    this.collisionOffsetBottom = 5;
    this.collisionOffsetLeft = 10;
    this.collisionOffsetRight = 10;
  }

  /**
   * Initializes the image cache object.
   */
  initImageCache() {
    this.imageCache = {};
  }

  /**
   * Loads an image from the given path.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = this.createImage(path);
  }

  /**
   * Creates and returns an Image object with the specified source path.
   * @param {string} path - The path to the image file.
   * @returns {HTMLImageElement} The created image element.
   */
  createImage(path) {
    const img = new Image();
    img.src = path;
    return img;
  }

  /**
   * Loads multiple images from an array of paths and caches them.
   * @param {string[]} paths - Array of image paths.
   */
  loadImages(paths) {
    paths.forEach(path => this.cacheImage(path));
  }

  /**
   * Creates an image, applies flipping, and caches it.
   * @param {string} path - The path to the image file.
   */
  cacheImage(path) {
    const img = this.createImage(path);
    this.applyImageFlip(img);
    this.imageCache[path] = img;
  }

  /**
   * Applies a horizontal flip transform to the given image element.
   * @param {HTMLImageElement} img - The image element to flip.
   */
  applyImageFlip(img) {
    img.style.transform = "scaleX(-1)";
  }

  /**
   * Draws the object on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    if (!this.hasImage()) return;
    this.renderImage(ctx);
  }

  /**
   * Checks if an image is currently loaded.
   * @returns {boolean} True if an image is loaded, otherwise false.
   */
  hasImage() {
    return this.img !== null;
  }

  /**
   * Renders the loaded image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  renderImage(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a frame around the object if it is a character.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawFrame(ctx) {
    if (!this.isCharacter()) return;
    this.renderCollisionBox(ctx);
  }

  /**
   * Checks if the object is an instance of Character.
   * @returns {boolean} True if the object is a Character, false otherwise.
   */
  isCharacter() {
    return this instanceof Character;
  }

  /**
   * Renders the collision box outline on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  renderCollisionBox(ctx) {
    ctx.beginPath();
    this.drawCollisionPath(ctx);
  }

  /**
   * Draws the collision box path on the canvas context.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawCollisionPath(ctx) {
    const box = this.getCollisionBox();
    ctx.rect(box.x, box.y, box.width, box.height);
  }

  /**
   * Returns the collision box coordinates and dimensions.
   * @returns {{x: number, y: number, width: number, height: number}} The collision box object.
   */
  getCollisionBox() {
    return {
      x: this.getCollisionX(),
      y: this.getCollisionY(), 
      width: this.getCollisionWidth(),
      height: this.getCollisionHeight()
    };
  }

  /**
   * Calculates the X coordinate of the collision box.
   * @returns {number} The X position of the collision box.
   */
  getCollisionX() {
    return this.x + this.collisionOffsetLeft;
  }

  /**
   * Calculates the Y coordinate of the collision box.
   * @returns {number} The Y position of the collision box.
   */
  getCollisionY() {
    return this.y + this.collisionOffsetTop;
  }

  /**
   * Calculates the width of the collision box.
   * @returns {number} The width of the collision box.
   */
  getCollisionWidth() {
    return this.width - this.collisionOffsetLeft - this.collisionOffsetRight;
  }

  /**
   * Calculates the height of the collision box.
   * @returns {number} The height of the collision box.
   */
  getCollisionHeight() {
    return this.height - this.collisionOffsetTop - this.collisionOffsetBottom;
  }
}
