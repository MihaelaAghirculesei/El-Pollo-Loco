class SmallChicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  isDead = false;
  
  IMAGES_DEAD = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];
  
  offset = { top: 5, bottom: 10, left: 10, right: 5 };
  
  IMAGES_WALKING = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.initializeImages();
    this.x = 600 + Math.random() * 4000;
    this.speed = 0.15 + Math.random() * 0.5;
    this.life = 1;
    this.health = 1;
    this.world = world;
  }

  initializeImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGES_DEAD[0]);
    this.loadImages(this.IMAGES_DEAD);
  }

  animate() {
    this.startMoving();
    this.startWalkingAnimation();
  }

  startMoving() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
  }

  startWalkingAnimation() {
    this.walkingInterval = setInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      200
    );
  }

  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
  }

  hit() {
    this.health--;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.stopMovementAndAnimation();
    this.playDeathAnimation();
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  playDeathAnimation() {
    this.loadImages(this.IMAGES_DEAD);
    this.playAnimation(this.IMAGES_DEAD);
  }

  stopCharacterVerticalMovement() {
    if (this.world?.character) {
      this.world.character.speedY = 0;
    }
  }

  removeFromWorldAfterDelay() {
    setTimeout(() => {
      this.removeFromWorld();
      this.markedForRemoval = true;
    }, 110);
  }

  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) {
      const enemyIndex = enemies.indexOf(this);
      if (enemyIndex !== -1) {
        enemies.splice(enemyIndex, 1);
      }
    }
  }

  isEnemyDead() {
    return this.health <= 0;
  }
}