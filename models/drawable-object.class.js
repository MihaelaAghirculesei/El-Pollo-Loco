/**
 * Base class for drawable objects.
 */
class DrawableObject {
  /**
   * Process-wide pool of decoded images, keyed by source path, shared by
   * every instance so a sprite is only ever created and decoded once.
   * @type {Object<string, HTMLImageElement>}
   */
  static imagePool = {};

  /**
   * Returns the pooled image for a path, creating it on first request.
   * @param {string} path - Image file path
   * @returns {HTMLImageElement} Shared image element
   */
  static getImage(path) {
    let img = DrawableObject.imagePool[path];
    if (!img) {
      img = new Image();
      img.src = path;
      DrawableObject.imagePool[path] = img;
    }
    return img;
  }

  /**
   * Creates drawable object and initializes properties.
   */
  constructor() {
    this.initPosition();
    this.initDimensions();
    this.initImageProperties();
    this.initCollisionOffsets();
    this.initImageCache();
  }

  /**
   * Initializes position coordinates.
   */
  initPosition() {
    this.x = 120;
    this.y = 250;
  }

  /**
   * Initializes object dimensions.
   */
  initDimensions() {
    this.height = 200;
    this.width = 100;
  }

  /**
   * Initializes image-related properties.
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
   * Initializes image cache object.
   */
  initImageCache() {
    this.imageCache = {};
  }

  /**
   * Loads image from given path.
   * @param {string} path - Image file path
   */
  loadImage(path) {
    this.img = DrawableObject.getImage(path);
  }

  /**
   * Creates and returns Image object.
   * @param {string} path - Image file path
   * @returns {HTMLImageElement} Shared image element
   */
  createImage(path) {
    return DrawableObject.getImage(path);
  }

  /**
   * Points this object's cache entries at the shared images.
   * @param {string[]} paths - Array of image paths
   */
  loadImages(paths) {
    paths.forEach(path => this.cacheImage(path));
  }

  /**
   * Resolves one path to its shared image and records it in the local cache.
   * @param {string} path - Image file path
   */
  cacheImage(path) {
    this.imageCache[path] = DrawableObject.getImage(path);
  }

  /**
   * Draws object on canvas context.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  draw(ctx) {
    if (!this.hasImage()) return;
    this.renderImage(ctx);
  }

  /**
   * Checks if image is loaded.
   * @returns {boolean} True if image loaded
   */
  hasImage() {
    return this.img !== null;
  }

  /**
   * Renders loaded image on canvas.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  renderImage(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws frame around character objects.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  drawFrame(ctx) {
    if (!this.isCharacter()) return;
    this.renderCollisionBox(ctx);
  }

  /**
   * Checks if object is Character instance.
   * @returns {boolean} True if Character
   */
  isCharacter() {
    return this instanceof Character;
  }

  /**
   * Renders collision box outline.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  renderCollisionBox(ctx) {
    ctx.beginPath();
    this.drawCollisionPath(ctx);
  }

  /**
   * Draws collision box path.
   * @param {CanvasRenderingContext2D} ctx - Rendering context
   */
  drawCollisionPath(ctx) {
    const box = this.getCollisionBox();
    ctx.rect(box.x, box.y, box.width, box.height);
  }

  /**
   * Gets collision box coordinates and dimensions.
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
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
   * Calculates collision box X coordinate.
   * @returns {number} X position
   */
  getCollisionX() {
    return this.x + this.collisionOffsetLeft;
  }

  /**
   * Calculates collision box Y coordinate.
   * @returns {number} Y position
   */
  getCollisionY() {
    return this.y + this.collisionOffsetTop;
  }

  /**
   * Calculates collision box width.
   * @returns {number} Width
   */
  getCollisionWidth() {
    return this.width - this.collisionOffsetLeft - this.collisionOffsetRight;
  }

  /**
   * Calculates collision box height.
   * @returns {number} Height
   */
  getCollisionHeight() {
    return this.height - this.collisionOffsetTop - this.collisionOffsetBottom;
  }
}