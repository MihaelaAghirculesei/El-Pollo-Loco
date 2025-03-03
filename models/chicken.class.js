class Chicken extends MovableObject{
    height = 70;
    width = 80;
    y = 360;
    isDead = false;
    IMAGE_DEAD = 'img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    IMAGES_WALKING = [
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        
    ];

    constructor(){
        super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
          this.loadImages(this.IMAGES_WALKING);
          this.x = 500 + Math.random()*500; 
          this.speed = 0.15 + Math.random() * 0.5;
          this.animate();
          this.life = 1;
          this.health = 2;  
    }
    
    animate() {
        setInterval(() =>{
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {                                          
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    hit() {
        this.health--;
        if (this.health == 0) {
            this.die();
        }
    }

    die() {
        this.dead = true;
        this.loadImage(this.IMAGE_DEAD);
        setTimeout(() => this.removeFromWorld(), 50);
    }

    isEnemyDead() {
        return this.health <= 0;
    }
}