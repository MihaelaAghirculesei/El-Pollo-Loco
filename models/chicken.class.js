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

        this.x = 200 + Math.random()*500; //( Math.random()*500;--> von der Konsole, startet in der unterschidliche stelle, jedes mahl)
        // this.speed = 0.15 + Math.random() * 0.5;
        this.speed = 0.15 + Math.random() * 0,8;

        this.animate();
    }
    


    animate() {
        this.moveLeft();
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length; //% =den rest und erhöht der index ab 7, let i = 6; 
            // i = 0,1,2,3,4,5,0,1,2,3,4,5,0
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);
    }
}