class StatusBarHeart extends DrawableObject {
  character;
  percentage = 100;

IMAGES = [
  "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png", //0
  "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
  "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
  "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
  "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
  "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png", //5
];

constructor(character) {
  super();
  this.x = 40;
  this.y = 0;
  this.width = 200;
  this.height = 60;
  this.loadImages(this.IMAGES);
  this.setPercentage(this.percentage);
  this.character = character;
}

// setPercentage (50);
setPercentage(percentage) {
  this.percentage = percentage; // => 0... 5 //100
  let path = this.IMAGES[this.resolveImageIndex()];
  this.img = this.imageCache[path];
}

resolveImageIndex() {
  if (this.percentage == 100) {
    return 5;
  } else if (this.percentage > 80) {
    return 4;
  } else if (this.percentage > 60) {
    return 3;
  } else if (this.percentage > 40) {
    return 2;
  } else if (this.percentage > 20) {
    return 1;
  } else {
    return 0;
  }
}
draw(ctx) {
  super.draw(ctx);
  if (this.character.life > 0) {
    this.drawHearts(ctx);
  }
}
// drawHearts(ctx) { VOHER
//   if (this.character.life > 0) {
//     // Controlla se ci sono vite extra da visualizzare
//     ctx.fillStyle = "red";
//     ctx.font = "30px Arial";
//     ctx.fillText(`❤️ x${this.character.life}`, this.x + 220, this.y + 52);
//   }
drawHearts(ctx) {
  if (this.character.life > 0) {
    // Controlla se ci sono vite extra da visualizzare
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText(`❤️ x${this.character.life}`, this.x + 220, this.y + 52);
  }
}
}
