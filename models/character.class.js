class Character extends MovableObject {
  height=240; y=80; speed=10;
  IMAGES_IDLE=Array.from({length:10},(_,i)=>`img_pollo_locco/img/2_character_pepe/1_idle/idle/I-${i+1}.png`);
  IMAGES_SLEEPING=Array.from({length:10},(_,i)=>`img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-${i+11}.png`);
  IMAGES_WALKING=Array.from({length:6},(_,i)=>`img_pollo_locco/img/2_character_pepe/2_walk/W-${21+i}.png`);
  IMAGES_JUMPING=Array.from({length:9},(_,i)=>`img_pollo_locco/img/2_character_pepe/3_jump/J-${31+i}.png`);
  IMAGES_HURT=Array.from({length:3},(_,i)=>`img_pollo_locco/img/2_character_pepe/4_hurt/H-${41+i}.png`);
  IMAGES_DEAD=Array.from({length:7},(_,i)=>`img_pollo_locco/img/2_character_pepe/5_dead/D-${51+i}.png`);
  hurt_sound=new Audio("audio/character-hurt-sound.mp3");
  snoringSound=new Audio("audio/character-snoring-sound.mp3");

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    [this.IMAGES_WALKING,this.IMAGES_JUMPING,this.IMAGES_DEAD,this.IMAGES_HURT,this.IMAGES_IDLE,this.IMAGES_SLEEPING].forEach(imgs=>this.loadImages(imgs));
    this.applyGravity();
    this.health=100; this.life=1; this.lastActionTime=Date.now()-6000; this.currentState="sleeping";
    this.snoringSound.loop=true; this.snoringSound.volume=0.9;
    this.animate();
  }

  animate() {
    this.handleMovement();
    this.handleStateTransitions();
    this.handleAnimations();
  }

  handleMovement() {
    setInterval(() => {
      if(this.world.keyboard.RIGHT) this.move("right");
      if(this.world.keyboard.LEFT) this.move("left");
      if(this.world.keyboard.SPACE && !this.isAboveGround()) { this.jump(); this.updateLastActionTime(); }
      this.world.camera_x = -this.x + 300;
    }, 1000/60);
  }

  move(direction) {
    if(direction==="right") { this.moveRight(); this.otherDirection=false; this.updateLastActionTime(); }
    else if(direction==="left" && this.x>0) { this.moveLeft(); this.otherDirection=true; this.updateLastActionTime(); }
  }

  handleStateTransitions() {
    setInterval(() => {
      const t=Date.now()-this.lastActionTime, prev=this.currentState;
      this.currentState = this.endbossDead() ? "active" : t>6000 && !this.isDead() ? "sleeping" : t>3000 ? "idle" : "active";
      if(this.currentState!==prev) this.handleStateChange();
      if(this.endbossDead()) this.muteSnoringSound();
    }, 100);
  }

  handleStateChange() {
    this.currentState==="sleeping" ? this.playSnoringSound() : this.muteSnoringSound();
  }

  handleAnimations() {
    setInterval(() => {
      if(this.isDead()) this.playAnimation(this.IMAGES_DEAD);
      else if(this.isHurt()) this.playAnimation(this.IMAGES_HURT);
      else if(this.currentState==="sleeping") this.playAnimation(this.IMAGES_SLEEPING);
      else if(this.currentState==="idle") this.playAnimation(this.IMAGES_IDLE);
      else if(this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
      else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) this.playAnimation(this.IMAGES_WALKING);
    }, 50);
  }

  updateLastActionTime = () => this.lastActionTime = Date.now();
  playSnoringSound = () => {
    if (isGameMuted)return;
    this.snoringSound.play();
  }
  muteSnoringSound = () => { this.snoringSound.pause(); this.snoringSound.currentTime=0; }
  jump = () => this.speedY=30;
  
  endbossDead() {
    const eb=this.world.enemies.find(e=>e instanceof Endboss);
    return eb ? eb.isEnemyDead() : (console.warn("Endboss not found in enemies array."), false);
  }
}