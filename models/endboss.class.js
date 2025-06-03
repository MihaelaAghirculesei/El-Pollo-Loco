class Endboss extends MovableObject {
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
    [this.IMAGES_WALKING, this.IMAGES_HURT, this.IMAGES_STAY].forEach((imgs) =>
      this.loadImages(imgs)
    );
    this.height = 400;
    this.width = 250;
    this.y = 60;
    this.x = 4000;
    this.health = 200;
    this.speed = 7;
    this.isDead = false;
    this.walking = true;
    this._isMoving = false;
    this._moveInterval = null;
    this.hurt_sound = new Audio("audio/endboss-hurt.mp3");
    this.atack_sound = new Audio("audio/endboss-atack.mp3");
  }

  startMoving() {
    if (!this._isMoving) {
      this._isMoving = true;
      this.animate();
    }
  }

  animate() {
    if (this._moveInterval) return;
    this._moveInterval = setInterval(() => {
      this.move();
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 10);
  }

  move() {
    if (!this.world?.character) return;
    const characterX = this.world.character.x;
    const distanceToKeep = 50;
    if (this.x < characterX - distanceToKeep) {
      this.x += this.speed;
      this.otherDirection = true;
    } else if (this.x > characterX + distanceToKeep) {
      this.x -= this.speed;
      this.otherDirection = false;
    }
  }

  getHealthPercent() {
    return Math.max(0, Math.round((this.health / 200) * 100));
  }

  hit() {
    if (this.isDead) return;
    this.health -= 1;
    if (this.health < 0) this.health = 0;
    this.playSound(this.hurt_sound);
    if (this.health > 0) {
      this.playAnimation(this.IMAGES_HURT);
    } else {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.playAnimation(this.IMAGES_HURT);
    this.playSound(this.hurt_sound);
    if (this._moveInterval) {
      clearInterval(this._moveInterval);
      this._moveInterval = null;
    }
    setTimeout(() => this.removeFromWorld(), 1000);
  }

  removeFromWorld() {
    if (this.world?.level?.enemies) {
      this.world.level.enemies = this.world.level.enemies.filter(
        (e) => e !== this
      );
    }
  }

  playSound = (sound) => {
    if (!isGameMuted) sound.play();
  };
  isEnemyDead = () => this.health <= 0;
}
