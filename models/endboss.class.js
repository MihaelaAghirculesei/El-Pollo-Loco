class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;
    isDead = false;  

    IMAGES_WALKING = [
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_HURT = [
        'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

constructor(){
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 4000;
    this.animate();
    this.life = 1;
    this.health = 6;
}

animate() {
    setInterval(() => {                                          
        this.playAnimation(this.IMAGES_WALKING);
    }, 200);
}

hit() {
    if (this.isDead) return;
        this.health--;
    if (this.health > 0) {
        this.loadImage(this.IMAGES_HURT[3 - this.health]);
    } else {
        this.die();
    }
}

die() {
    this.dead = true;
    this.loadImage(this.IMAGES_HURT[2]);
    setTimeout(() => this.removeFromWorld(), 1000);
}

isEnemyDead() {
    return this.health <= 0;
    }  
}