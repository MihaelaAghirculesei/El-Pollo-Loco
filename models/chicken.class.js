class Chicken extends MovableObject{
    height = 70;
    width = 80;
    y = 360;

    IMAGES_WALKING = [
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        
    ];

    constructor(){
        super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
          this.loadImages(this.IMAGES_WALKING);
          this.x = 1000 + Math.random()*2000; 
          this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
    }
    
    animate() {
        this.moveLeft();

        setInterval(() => {                                          
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}