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
    IMAGES_WALKING_LEFT = [
        'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

constructor(){
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 4000;
    this.animate();
    this.life = 1;
    this.health = 6;
    this.loadImages(this.IMAGES_WALKING_LEFT);
    this.loadImages(this.IMAGES_HURT);
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
        this.playAnimation(this.IMAGES_HURT);
        this.playSound(endbossHurt);
    } else {
        this.die();
    }
}

die() {
    this.dead = true;
    this.playAnimation(this.IMAGES_HURT);
    this.playSound(endbossHurt);
    setTimeout(() => this.removeFromWorld(), 1000);
}

playSound(sound) {
    if (!isGameMuted) {
        sound.play();
    }
}
}