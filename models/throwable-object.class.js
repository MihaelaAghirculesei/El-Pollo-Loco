class ThrowableObjecet extends MovableObject {

    constructor (x, y) {
        super().loadImage('img_pollo_locco/img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.trow();
    }

    trow(){

        this.speedy = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 30);

    }

}