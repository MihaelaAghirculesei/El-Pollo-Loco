class StatusBarHeartCharacter extends DrawableObject {
  static IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
  ];

  constructor(character) {
    super();
    this.character = character;
    this.setupStatusBar();
    this.loadImages(StatusBarHeartCharacter.IMAGES);
    this.setPercentage(100);
  }

  setupStatusBar() {
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  setPercentage(percentage) {
    this.percentage = this.clampPercentage(percentage);
    this.updateStatusBarImage();
  }

  clampPercentage(percentage) {
    return Math.max(0, Math.min(percentage, 100));
  }

  updateStatusBarImage() {
    const imageIndex = this.getImageIndex();
    this.img = this.imageCache[StatusBarHeartCharacter.IMAGES[imageIndex]];
  }

  getImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }

  draw(ctx) {
    super.draw(ctx);
    this.drawHearts(ctx);
  }

  drawHearts(ctx) {
    if (this.character.life > 0) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText(`❤️ x${this.character.life}`, this.x + 220, this.y + 52);
    }
  }
}
