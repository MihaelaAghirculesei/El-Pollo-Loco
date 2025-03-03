class Bottle extends MovableObject {
    bottleImg = [
        'img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    y = 380;
    height = 100;
    width = 100;

    oftset = {
        top: 16,
        left: 32,
        right: 25,
        bottom:8
    }

    constructor (x, y) {
        super().loadImage('img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.bottleImg);
        this.x = x;
        this.y = y;
        this.animateBottle();
    }
    
    animateBottle() {
        setInterval(() => {
          this.playAnimation(this.bottleImg);
        }, 300);
      }
}