class StatusBarBottle extends DrawableObject {
  MAX_BOTTLES = 27;
  IMAGES = [
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];
  bottlesCount = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPosition();
    this.setSize();
    this.setBottlesCount(0);
  }

  setPosition() {
    this.x = 40;
    this.y = 40;
  }

  setSize() {
    this.width = 200;
    this.height = 60;
  }

  setBottlesCount(count) {
    this.bottlesCount = Math.max(0, Math.min(count, this.MAX_BOTTLES)); 
    this.updateImage();
  }

updateImage() {
    let percent = this.bottlesCount / this.MAX_BOTTLES;
    let idx = Math.floor(percent * (this.IMAGES.length - 1));
    this.img = this.imageCache[this.IMAGES[idx]];
}
}
