class StatusBarBottle extends DrawableObject {
    MAX_BOTTLES = 10;

    IMAGES = [
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png', //0
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    percentageBottle = 0;

    constructor(){
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 40;
        this.width = 200;
        this.height = 60;
        this.setPercentageBottle(0);  
        // this.ensureInitialImageLoaded();
    }

    setPercentageBottle(percentage) {
        this.percentageBottle = percentage; // Diese Zeile hinzufügen
        if (percentage >= this.MAX_BOTTLES) {
            percentage = percentage % this.MAX_BOTTLES;
        }
        let imagePath = this.resolveImageIndex();
        this.img = this.imageCache[imagePath];
    }

    resolveImageIndex() {
        if (this.percentageBottle == 100) {
            return this.IMAGES[5];
            } else if (this.percentageBottle >= 80) {
                return this.IMAGES[4];
            } else if (this.percentageBottle > 60) {
                return this.IMAGES[3];
            } else if (this.percentageBottle > 40) {
                return this.IMAGES[2];
            } else if(this.percentageBottle > 20) {
                return this.IMAGES[1];
            } else {
                return this.IMAGES[0];
            }

            }        
    }