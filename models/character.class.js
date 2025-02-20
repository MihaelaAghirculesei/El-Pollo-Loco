class Character extends MovableObject {

height = 280;
y = 160;
speed = 10;
IMAGES_WALKING = [
    'img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
];
world;

constructor(){
    super().loadImage('img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
}

animate() {

    setInterval(() => {
        if(this.world.keyboard.RIGHT) {
            this.x += this.speed;
            this.otherDirection = false;
        }

        if(this.world.keyboard.LEFT) {
            this.x -= this.speed;
            this.otherDirection = true;
        }
    }, 1000 / 60);


    setInterval(() => {
        if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.x += this.speed;
             let i = this.currentImage % this.IMAGES_WALKING.length; //% =den rest und erhöht der index ab 7, let i = 6; 
              // Walk animation i = 0,1,2,3,4,5,0,1,2,3,4,5,0
             let path = this.IMAGES_WALKING[i];
             this.img = this.imageCache[path];
             this.currentImage++;
    }
    },50);
}

    jump(){

    }
}