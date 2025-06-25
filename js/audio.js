/**
 * Global mute state flag for the game.
 * @type {boolean}
 */
let isGameMuted = true;

/**
 * Manages all audio functionalities in the game.
 */
class AudioManager {
  constructor() {
    /** @private */
    this.AUDIO_PATHS = this.defineAudioPaths();
    this.isGameMuted = true;
    this.isMusicPlaying = false;
    this.audioPool = {};
    this.backgroundMusic = this.createBackgroundMusic();
    this.characterSnoringSound = null;
    this.preloadFrequentSounds();
  }

  /**
   * Defines and returns all audio file paths.
   * @returns {Object<string, string>} Audio file paths.
   */
  defineAudioPaths() {
    return {
      BACKGROUND: "audio/game.mp3",
      CHARACTER_HURT: "audio/character-hurt-sound.mp3",
      CHARACTER_SNORING: "audio/character-snoring-sound.mp3",
      CHICKEN_HURT: "audio/chicken-hurt.mp3",
      SMALL_CHICKEN_HURT: "audio/small-chicken-hurt.mp3",
      NEW_LIFE: "audio/new-life.mp3",
      ENDBOSS_ATTACK: "audio/endboss-atack.mp3",
      ENDBOSS_HURT: "audio/endboss-hurt.mp3",
      LOSE_GAME: "audio/lose-game-sound.mp3",
      WIN_GAME: "audio/winning-game-sound.mp3",
      COIN_COLLECT: "audio/coin-collect-sound.mp3",
      BOTTLE_COLLECT: "audio/bottle-collect-sound.mp3"
    };
  }

  /**
   * Preloads frequently used sounds into audio pools.
   */
  preloadFrequentSounds() {
    const frequentSounds = [
      this.AUDIO_PATHS.COIN_COLLECT,
      this.AUDIO_PATHS.BOTTLE_COLLECT,
      this.AUDIO_PATHS.CHARACTER_HURT,
      this.AUDIO_PATHS.CHICKEN_HURT,
      this.AUDIO_PATHS.SMALL_CHICKEN_HURT,
      this.AUDIO_PATHS.ENDBOSS_HURT
    ];
    frequentSounds.forEach(path => this.createAudioPool(path, 3));
  }

  /**
   * Creates a pool of audio instances for a given sound.
   * @param {string} path - The audio file path.
   * @param {number} poolSize - Number of instances in the pool.
   */
  createAudioPool(path, poolSize = 3) {
    if (this.audioPool[path]) return;
    const pool = { instances: [], currentIndex: 0 };
    for (let i = 0; i < poolSize; i++) {
      pool.instances.push(this.createAudioInstance(path, 0.2));
    }
    this.audioPool[path] = pool;
  }

  /**
   * Creates an individual audio instance.
   * @param {string} path - The path to the audio file.
   * @param {number} volume - Initial volume level.
   * @returns {HTMLAudioElement}
   */
  createAudioInstance(path, volume) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.preload = 'auto';
    return audio;
  }

  /**
   * Initializes background music.
   * @returns {HTMLAudioElement}
   */
  createBackgroundMusic() {
    return this.createAudioInstance(this.AUDIO_PATHS.BACKGROUND, 0.1);
  }

  /**
   * Plays a sound by path, using pool if available.
   * @param {string} path
   * @param {number} [volume=0.2]
   */
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

  /**
   * Stops and resets an audio instance.
   * @param {HTMLAudioElement} audio
   */
  stopAudio(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  /** Starts background music playback. */
  playBackgroundMusic() {
    this.backgroundMusic.play().catch(() => {});
    this.isMusicPlaying = true;
  }

  /** Stops background music playback. */
  stopBackgroundMusic() {
    this.stopAudio(this.backgroundMusic);
    this.isMusicPlaying = false;
  }

  /** Initializes snoring sound for character. */
  initCharacterSnoring() {
    if (!this.characterSnoringSound) {
      this.characterSnoringSound = this.createAudioInstance(
        this.AUDIO_PATHS.CHARACTER_SNORING,
        0.9
      );
      this.characterSnoringSound.loop = true;
    }
  }

  /** Plays character snoring sound if not muted. */
  playCharacterSnoring() {
    if (this.isGameMuted) return;
    this.initCharacterSnoring();
    this.characterSnoringSound.play().catch(() => {});
  }

  /** Stops character snoring sound. */
  stopCharacterSnoring() {
    this.stopAudio(this.characterSnoringSound);
  }

  /**
   * Creates looping music for endboss.
   * @returns {HTMLAudioElement}
   */
  createEndbossMusic() {
    const music = this.createAudioInstance(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.5);
    music.loop = true;
    return music;
  }

  /**
   * Plays endboss attack music in the given world.
   * @param {Object} world
   */
  playEndbossAttackMusic(world) {
    if (world.endbossAttackMusic || this.isGameMuted) return;
    world.endbossAttackMusic = this.createEndbossMusic();
    world.endbossAttackMusic.play().catch(() => {});
  }

  /**
   * Stops endboss attack music.
   * @param {Object} world
   */
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
  playEndbossHurtSound() { this.playSound(this.AUDIO_PATHS.ENDBOSS_HURT, 0.3); }
  playEndbossAttackSound() { this.playSound(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.4); }

  /**
   * Plays hurt sound based on enemy type.
   * @param {Object} enemy
   */
  playEnemyHurtSound(enemy) {
    this.playSound(this.getEnemyHurtSoundPath(enemy));
  }

  /**
   * Determines correct hurt sound path for an enemy.
   * @param {Object} enemy
   * @returns {string}
   */
  getEnemyHurtSoundPath(enemy) {
    return enemy.constructor.name === 'SmallChicken'
      ? this.AUDIO_PATHS.SMALL_CHICKEN_HURT
      : this.AUDIO_PATHS.CHICKEN_HURT;
  }

  /**
   * Mutes a sound on a given entity.
   * @param {Object} entity
   * @param {string} soundProperty
   */
  muteEntitySound(entity, soundProperty) {
    if (entity?.[soundProperty]) entity[soundProperty].pause();
  }

  /**
   * Mutes all sounds in an array of entities.
   * @param {Object[]} array
   * @param {string} soundProperty
   */
  muteArraySounds(array, soundProperty) {
    array?.forEach(item => this.muteEntitySound(item, soundProperty));
  }

  /**
   * Mutes all endboss-related sounds.
   * @param {Object} endboss
   */
  muteEndbossSounds(endboss) {
    ['alert_sound', 'hurt_sound', 'dead_sound'].forEach(sound =>
      this.muteEntitySound(endboss, sound)
    );
  }

  /**
   * Mutes all endbosses in an array.
   * @param {Object[]} endbossArray
   */
  muteAllEndbosses(endbossArray) {
    endbossArray?.forEach(endboss => this.muteEndbossSounds(endboss));
  }

  /**
   * Mutes all sounds in the current game world.
   * @param {Object} world
   */
  muteGameSounds(world) {
    if (!world?.level) return;
    const { level, character } = world;
    this.muteEntitySound(character, "hurt_sound");
    this.stopCharacterSnoring();
    this.muteArraySounds(level.enemies, "chicken_sound");
    this.muteAllEndbosses(level.endboss);
  }

  /**
   * Enables all game sounds.
   * @param {Object} world
   */
  enableAllSounds(world) {
    if (!this.isMusicPlaying) {
      this.playBackgroundMusic();
      this.playSnoringIfSleeping(world);
    }
  }

  /**
   * Plays snoring sound if character is sleeping.
   * @param {Object} world
   */
  playSnoringIfSleeping(world) {
    if (world?.character?.currentState === "sleeping") {
      this.playCharacterSnoring();
    }
  }

  /**
   * Disables all game sounds.
   * @param {Object} world
   */
  disableAllSounds(world) {
    this.stopBackgroundMusic();
    this.muteGameSounds(world);
    this.stopEndbossAttackMusic(world);
  }

  /**
   * Stops all game-related end sounds.
   * @param {Object} world
   */
  stopAllGameEndSounds(world) {
    this.stopCharacterSnoring();
    this.stopEndbossAttackMusic(world);
    this.stopBackgroundMusic();
  }

  /**
   * Toggles sound on or off.
   * @param {Object} world
   */
  toggleSound(world) {
    this.isGameMuted ? this.enableAllSounds(world) : this.disableAllSounds(world);
    this.isGameMuted = !this.isGameMuted;
    isGameMuted = this.isGameMuted;
    this.updateSoundButton();
  }

  /** Updates the UI button text for sound. */
  updateSoundButton() {
    const button = document.getElementById("music-toggle-button");
    if (button) {
      button.innerText = this.isGameMuted ? "Sound: Off" : "Sound: On";
      button.blur();
    }
  }
}

/**
 * Global instance of the AudioManager.
 * @type {AudioManager}
 */
const audioManager = new AudioManager();

// Exported utility functions
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
const playEndbossHurtSound = () => audioManager.playEndbossHurtSound();
const playEndbossAttackSound = () => audioManager.playEndbossAttackSound();
