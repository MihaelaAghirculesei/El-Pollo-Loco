class StatusBarCoins extends DrawableObject {

    IMAGES = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
];

percentageCoins = 0;

constructor(){
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;
    this.y = 80;
    this.width = 200;
    this.height = 60;
    this.setPercentageCoins(0); 
}

setPercentageCoins (percentage) {
    this.percentageCoins = percentage % 31; 
    let imagePath = this.resolveImageIndex();
    this.img = this.imageCache[imagePath];
}

resolveImageIndex() {
    if (this.percentageCoins == 30) {
        return this.IMAGES[5];
        } else if (this.percentageCoins >= 24) {
            return this.IMAGES[4];
        } else if (this.percentageCoins > 18) {
            return this.IMAGES[3];
        } else if (this.percentageCoins > 12) {
            return this.IMAGES[2];
        } else if(this.percentageCoins > 6) {
            return this.IMAGES[1];
        } else {
            return this.IMAGES[0];
        }
    }
}