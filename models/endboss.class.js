class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 60;
    isDead = false;  
    hurt_sound = new Audio('audio/endboss-hurt.mp3'); // Sound für Verletzung
    atack_sound = new Audio('audio/endboss-atack.mp3'); // Sound für Angriff

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
    this.loadImages(this.IMAGES_HURT);
    this.x = 4000;
    this.animate();
    this.life = 1;
    this.health = 15;
    this.speed = 1;
}

animate() {
    setInterval(() => {                                          
        if (!this.isDead) {
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING); // Animation für Laufen
        }
    }, 200);
}
move() {
    if (this.isMovingLeft()) {
        this.moveLeft();
        this.otherDirection = true;
    } else {
        this.moveRight();
        this.otherDirection = false;
    }
}

isMovingLeft() {
    return Math.random() < 0.5;  // 50% Chance, sich nach links zu bewegen
}

moveLeft() {
    this.x -= this.speed;
}

moveRight() {
    this.x += this.speed;
}

hit() {
    if (this.isDead) return;
        this.health--;
        this.playSound(endbossHurt);
        if (this.health > 0) {
            this.playAnimation(this.IMAGES_HURT);
        } else {
            this.die();
        }
    }

    die() {
        this.isDead = true;
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