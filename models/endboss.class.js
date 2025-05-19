class Endboss extends MovableObject {
  height = 400; width = 250; y = 60; isDead = false; walking = true;
  hurt_sound = new Audio("audio/endboss-hurt.mp3");
  atack_sound = new Audio("audio/endboss-atack.mp3");
  
  IMAGES_WALKING = [
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_HURT = [
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  IMAGES_STAY = [
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png",
    "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    [this.IMAGES_WALKING, this.IMAGES_HURT, this.IMAGES_STAY].forEach(imgs => this.loadImages(imgs));
    this.x = 4000; this.health = 200; this.speed = 1;
     this._isMoving = false;
  }

   startMoving() {
    if (!this._isMoving) {
      this._isMoving = true;
      this.animate();
    }
  }

  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
    setInterval(() => this.toggleAnimation(), 200);
  }

  toggleAnimation() {
    this.playAnimation(this.walking ? this.IMAGES_WALKING : this.IMAGES_STAY);
    this.walking = !this.walking;
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

  isMovingLeft = () => Math.random() < 0.5;
  moveLeft = () => this.x -= this.speed;
  moveRight = () => this.x += this.speed;

    getHealthPercent() {
  return Math.max(0, Math.round((this.health / 200) * 100));
}

  hit() {
    if (this.isDead) return;
    this.health -= 1;
    if (this.health < 0) this.health = 0;
    this.playSound(this.hurt_sound);
    this.health > 0 ? this.playAnimation(this.IMAGES_HURT) : this.die();
  }

  die() {
    this.isDead = true;
    this.playAnimation(this.IMAGES_HURT);
    this.playSound(this.hurt_sound);
    setTimeout(() => this.removeFromWorld(), 1000);
  }

  removeFromWorld() {
    if (this.world?.level?.enemies) {
      this.world.level.enemies = this.world.level.enemies.filter(e => e !== this);
    }
  }
  
  playSound = sound => { if (!isGameMuted) sound.play(); }
  isEnemyDead = () => this.health <= 0;
}