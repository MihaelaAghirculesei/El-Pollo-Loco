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
    this.percentageCoins = percentage; // => 0... 5 //100
    let imagePath = this.resolveImageIndex();
    this.img = this.imageCache[imagePath];
}

resolveImageIndex() {
    if (this.percentageCoins == 100) {
        return this.IMAGES[5];
        } else if (this.percentageCoins >= 80) {
            return this.IMAGES[4];
        } else if (this.percentageCoins > 60) {
            return this.IMAGES[3];
        } else if (this.percentageCoins > 40) {
            return this.IMAGES[2];
        } else if(this.percentageCoins > 20) {
            return this.IMAGES[1];
        } else {
            return this.IMAGES[0];
        }
    }
}