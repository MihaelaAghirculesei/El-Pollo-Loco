class Chicken extends MovableObject {
  static IMAGES_DEAD = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  static IMAGES_WALKING = [
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor(world) {
    super();
    this.height = 70;
    this.width = 80;
    this.y = 360;
    this.isDead = false;
    this.life = 1;
    this.health = 2;
    this.world = world;
    this.markedForRemoval = false;
    this.x = 800 + Math.random() * 4500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.loadImage(Chicken.IMAGES_WALKING[0]);
    this.loadImages(Chicken.IMAGES_WALKING);
    this.loadImage(Chicken.IMAGES_DEAD[0]);
    this.loadImages(Chicken.IMAGES_DEAD);
  }

  animate() {
    this.startMovement();
    this.startWalkingAnimation();
  }
  startMovement() {
    this.movementInterval = setInterval(() => this.moveLeft(), 1000 / 60);
  }
  startWalkingAnimation() {
    this.walkingInterval = setInterval(
      () => this.playAnimation(Chicken.IMAGES_WALKING),
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
    this.loadImages(Chicken.IMAGES_DEAD);
    this.playAnimation(Chicken.IMAGES_DEAD);
    this.stopCharacterVerticalMovement();
    this.removeFromWorldAfterDelay();
  }

  stopMovementAndAnimation() {
    clearInterval(this.movementInterval);
    clearInterval(this.walkingInterval);
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
    }, 70);
  }
  removeFromWorld() {
    const enemies = this.world?.level?.enemies;
    if (enemies) this.world.level.enemies = enemies.filter((e) => e !== this);
  }
  isEnemyDead() {
    return this.health <= 0;
  }
}
