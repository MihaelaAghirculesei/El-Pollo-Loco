let isGameMuted = true;

class AudioManager {
  constructor() {
    this.AUDIO_PATHS = {
      BACKGROUND: "audio/game.mp3",
      CHARACTER_HURT: "audio/character-hurt-sound.mp3",
      CHARACTER_SNORING: "audio/character-snoring-sound.mp3",
      CHICKEN_HURT: "audio/chicken-hurt.mp3",
      SMALL_CHICKEN_HURT: "audio/small-chicken-hurt.mp3",
      NEW_LIFE: "audio/new-life.mp3",
      ENDBOSS_ATTACK: "audio/endboss-atack.mp3",
      LOSE_GAME: "audio/lose-game-sound.mp3",
      WIN_GAME: "audio/winning-game-sound.mp3"
    };

    this.isGameMuted = true;
    this.isMusicPlaying = false;
    this.audioInstances = {};
    this.backgroundMusic = this.createBackgroundMusic();
    this.characterSnoringSound = null;
    this.currentSounds = {};
  }

  createBackgroundMusic() {
    const music = new Audio(this.AUDIO_PATHS.BACKGROUND);
    music.loop = true;
    music.volume = 0.1;
    return music;
  }

  createAudioInstance(path, volume = 0.2) {
    if (!this.audioInstances[path]) {
      this.audioInstances[path] = new Audio(path);
      this.audioInstances[path].volume = volume;
    }
    return this.audioInstances[path];
  }

  playSound(path, volume = 0.2) {
    if (this.isGameMuted) return;
    const audio = this.createAudioInstance(path, volume);
    this.restartAndPlay(audio);
  }

  restartAndPlay(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
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
      this.characterSnoringSound = new Audio(this.AUDIO_PATHS.CHARACTER_SNORING);
      this.characterSnoringSound.loop = true;
      this.characterSnoringSound.volume = 0.9;
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
    const music = new Audio(this.AUDIO_PATHS.ENDBOSS_ATTACK);
    music.loop = true;
    music.volume = 0.5;
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

  playNewLifeSound() {
    this.playSound(this.AUDIO_PATHS.NEW_LIFE);
  }

  playCharacterHurtSound() {
    this.playSound(this.AUDIO_PATHS.CHARACTER_HURT);
  }

  playEnemyHurtSound(enemy) {
    const soundPath = this.getEnemyHurtSoundPath(enemy);
    this.playSound(soundPath);
  }

  getEnemyHurtSoundPath(enemy) {
    return enemy.constructor.name === 'SmallChicken'
      ? this.AUDIO_PATHS.SMALL_CHICKEN_HURT
      : this.AUDIO_PATHS.CHICKEN_HURT;
  }

  playGameOverSound() {
    this.playSound(this.AUDIO_PATHS.LOSE_GAME);
  }

  playGameWonSound() {
    this.playSound(this.AUDIO_PATHS.WIN_GAME);
  }

  muteEntitySound(entity, soundProperty) {
    if (entity?.[soundProperty]) entity[soundProperty].pause();
  }

  muteArraySounds(array, soundProperty) {
    array?.forEach(item => this.muteEntitySound(item, soundProperty));
  }

  muteEndbossSounds(endboss) {
    ['alert_sound', 'hurt_sound', 'dead_sound'].forEach(sound => {
      this.muteEntitySound(endboss, sound);
    });
  }

  muteAllEndbosses(endbossArray) {
    endbossArray?.forEach(endboss => this.muteEndbossSounds(endboss));
  }

  muteGameSounds(world) {
    if (!world?.level) return;
    const { level, character } = world;
    this.muteArraySounds(level.bottle, "collect_sound");
    this.muteArraySounds(level.coins, "collect_sound");
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
const stopAllGameEndSounds = (world) => audioManager.stopAllGameEndSounds(world);
const toggleSound = (world) => audioManager.toggleSound(world);
const enableAllSounds = (world) => audioManager.enableAllSounds(world);
const disableAllSounds = (world) => audioManager.disableAllSounds(world);
const muteAllSounds = (world) => audioManager.muteGameSounds(world);