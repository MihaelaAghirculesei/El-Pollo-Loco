let isGameMuted = true;

class AudioManager {
  constructor() {
    this.AUDIO_PATHS = this.defineAudioPaths();
    this.isGameMuted = true;
    this.isMusicPlaying = false;
    this.audioPool = {};
    this.backgroundMusic = this.createBackgroundMusic();
    this.characterSnoringSound = null;
    this.preloadFrequentSounds();
  }

  defineAudioPaths() {
    return {
      BACKGROUND: "audio/game.mp3",
      CHARACTER_HURT: "audio/character-hurt-sound.mp3",
      CHARACTER_SNORING: "audio/character-snoring-sound.mp3",
      CHICKEN_HURT: "audio/chicken-hurt.mp3",
      SMALL_CHICKEN_HURT: "audio/small-chicken-hurt.mp3",
      NEW_LIFE: "audio/new-life.mp3",
      ENDBOSS_ATTACK: "audio/endboss-atack.mp3",
      LOSE_GAME: "audio/lose-game-sound.mp3",
      WIN_GAME: "audio/winning-game-sound.mp3",
      COIN_COLLECT: "audio/coin-collect-sound.mp3",
      BOTTLE_COLLECT: "audio/bottle-collect-sound.mp3"
    };
  }

  preloadFrequentSounds() {
    const frequentSounds = [
      this.AUDIO_PATHS.COIN_COLLECT,
      this.AUDIO_PATHS.BOTTLE_COLLECT,
      this.AUDIO_PATHS.CHARACTER_HURT,
      this.AUDIO_PATHS.CHICKEN_HURT,
      this.AUDIO_PATHS.SMALL_CHICKEN_HURT
    ];

    frequentSounds.forEach(path => this.createAudioPool(path, 3));
  }

  createAudioPool(path, poolSize = 3) {
    if (this.audioPool[path]) return;

    const pool = { instances: [], currentIndex: 0 };
    for (let i = 0; i < poolSize; i++) {
      pool.instances.push(this.createAudioInstance(path, 0.2));
    }
    this.audioPool[path] = pool;
  }

  createAudioInstance(path, volume) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.preload = 'auto';
    return audio;
  }

  createBackgroundMusic() {
    return this.createAudioInstance(this.AUDIO_PATHS.BACKGROUND, 0.1);
  }

  playSound(path, volume = 0.2) {
    if (this.isGameMuted) return;
    const pool = this.audioPool[path];
    if (pool) {
      const audio = pool.instances[pool.currentIndex];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
    } else {
      const audio = this.createAudioInstance(path, volume);
      audio.play().catch(() => {});
    }
  }

  stopAudio(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  playBackgroundMusic() {
    this.backgroundMusic.play().catch(() => {});
    this.isMusicPlaying = true;
  }

  stopBackgroundMusic() {
    this.stopAudio(this.backgroundMusic);
    this.isMusicPlaying = false;
  }

  initCharacterSnoring() {
    if (!this.characterSnoringSound) {
      this.characterSnoringSound = this.createAudioInstance(
        this.AUDIO_PATHS.CHARACTER_SNORING,
        0.9
      );
      this.characterSnoringSound.loop = true;
    }
  }

  playCharacterSnoring() {
    if (this.isGameMuted) return;
    this.initCharacterSnoring();
    this.characterSnoringSound.play().catch(() => {});
  }

  stopCharacterSnoring() {
    this.stopAudio(this.characterSnoringSound);
  }

  createEndbossMusic() {
    const music = this.createAudioInstance(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.5);
    music.loop = true;
    return music;
  }

  playEndbossAttackMusic(world) {
    if (world.endbossAttackMusic || this.isGameMuted) return;
    world.endbossAttackMusic = this.createEndbossMusic();
    world.endbossAttackMusic.play().catch(() => {});
  }

  stopEndbossAttackMusic(world) {
    if (!world?.endbossAttackMusic) return;
    this.stopAudio(world.endbossAttackMusic);
    world.endbossAttackMusic = null;
    world.endbossAttackStarted = false;
  }

  playNewLifeSound() { this.playSound(this.AUDIO_PATHS.NEW_LIFE); }
  playCharacterHurtSound() { this.playSound(this.AUDIO_PATHS.CHARACTER_HURT); }
  playCoinCollectSound() { this.playSound(this.AUDIO_PATHS.COIN_COLLECT); }
  playBottleCollectSound() { this.playSound(this.AUDIO_PATHS.BOTTLE_COLLECT); }
  playGameOverSound() { this.playSound(this.AUDIO_PATHS.LOSE_GAME); }
  playGameWonSound() { this.playSound(this.AUDIO_PATHS.WIN_GAME); }

  playEnemyHurtSound(enemy) {
    this.playSound(this.getEnemyHurtSoundPath(enemy));
  }

  getEnemyHurtSoundPath(enemy) {
    return enemy.constructor.name === 'SmallChicken'
      ? this.AUDIO_PATHS.SMALL_CHICKEN_HURT
      : this.AUDIO_PATHS.CHICKEN_HURT;
  }

  muteEntitySound(entity, soundProperty) {
    if (entity?.[soundProperty]) entity[soundProperty].pause();
  }

  muteArraySounds(array, soundProperty) {
    array?.forEach(item => this.muteEntitySound(item, soundProperty));
  }

  muteEndbossSounds(endboss) {
    ['alert_sound', 'hurt_sound', 'dead_sound'].forEach(sound =>
      this.muteEntitySound(endboss, sound)
    );
  }

  muteAllEndbosses(endbossArray) {
    endbossArray?.forEach(endboss => this.muteEndbossSounds(endboss));
  }

  muteGameSounds(world) {
    if (!world?.level) return;
    const { level, character } = world;
    this.muteEntitySound(character, "hurt_sound");
    this.stopCharacterSnoring();
    this.muteArraySounds(level.enemies, "chicken_sound");
    this.muteAllEndbosses(level.endboss);
  }

  enableAllSounds(world) {
    if (!this.isMusicPlaying) {
      this.playBackgroundMusic();
      this.playSnoringIfSleeping(world);
    }
  }

  playSnoringIfSleeping(world) {
    if (world?.character?.currentState === "sleeping") {
      this.playCharacterSnoring();
    }
  }

  disableAllSounds(world) {
    this.stopBackgroundMusic();
    this.muteGameSounds(world);
    this.stopEndbossAttackMusic(world);
  }

  stopAllGameEndSounds(world) {
    this.stopCharacterSnoring();
    this.stopEndbossAttackMusic(world);
    this.stopBackgroundMusic();
  }

  toggleSound(world) {
    this.isGameMuted ? this.enableAllSounds(world) : this.disableAllSounds(world);
    this.isGameMuted = !this.isGameMuted;
    isGameMuted = this.isGameMuted;
    this.updateSoundButton();
  }

  updateSoundButton() {
    const button = document.getElementById("music-toggle-button");
    if (button) {
      button.innerText = this.isGameMuted ? "Sound: Off" : "Sound: On";
      button.blur();
    }
  }
}

const audioManager = new AudioManager();

const playSound = (path, volume) => audioManager.playSound(path, volume);
const playCharacterSnoringSound = () => audioManager.playCharacterSnoring();
const stopCharacterSnoringSound = () => audioManager.stopCharacterSnoring();
const playBackgroundMusic = () => audioManager.playBackgroundMusic();
const stopBackgroundMusic = () => audioManager.stopBackgroundMusic();
const playEndbossAttackMusic = (world) => audioManager.playEndbossAttackMusic(world);
const stopEndbossAttackMusic = (world) => audioManager.stopEndbossAttackMusic(world);
const playNewLifeSound = () => audioManager.playNewLifeSound();
const playEnemyHurtSound = (enemy) => audioManager.playEnemyHurtSound(enemy);
const playCharacterHurtSound = () => audioManager.playCharacterHurtSound();
const playGameOverSound = () => audioManager.playGameOverSound();
const playGameWonSound = () => audioManager.playGameWonSound();
const playCoinCollectSound = () => audioManager.playCoinCollectSound();
const playBottleCollectSound = () => audioManager.playBottleCollectSound();
const stopAllGameEndSounds = (world) => audioManager.stopAllGameEndSounds(world);
const toggleSound = (world) => audioManager.toggleSound(world);
const enableAllSounds = (world) => audioManager.enableAllSounds(world);
const disableAllSounds = (world) => audioManager.disableAllSounds(world);
const muteAllSounds = (world) => audioManager.muteGameSounds(world);