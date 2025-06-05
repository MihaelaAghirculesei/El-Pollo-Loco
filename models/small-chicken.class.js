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
    this.loadImages(this.IMAGES_WALKING);
    this.loadImage(this.IMAGES_DEAD[0]);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 600 + Math.random() * 4000;
    this.speed = 0.15 + Math.random() * 0.5;
    this.life = 1;
    this.health = 1;
    this.world = world;
  }

  animate() {
    this.startMoving();
    this.startWalkingAnimation();
  }

  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
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

  hit() {
    this.decreaseHealth();
    if (this.isEnemyDead()) this.die();
  }

  decreaseHealth() {
    this.health--;
  }

  die() {
    this.isDead = true;
    this.stopMovementAndAnimation();
    this.loadImages(this.IMAGES_DEAD);
    this.playAnimation(this.IMAGES_DEAD);
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  stopCharacterVerticalMovement() {
    if (this.world?.character) this.world.character.speedY = 0;
  }

  markForRemoval() {
    this.markedForRemoval = true;
  }

  removeFromWorldAfterDelay() {
    setTimeout(() => {
      this.removeFromWorld();
      this.markForRemoval();
    }, 110);
  }

  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) {
      const idx = enemies.indexOf(this);
      if (idx !== -1) enemies.splice(idx, 1);
    }
  }

  isEnemyDead() {
    return this.health <= 0;
  }
}
