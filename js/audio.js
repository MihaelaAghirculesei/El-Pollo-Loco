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
    this.initialize();
  }

  /**
   * Initializes AudioManager properties.
   */
  initProperties() {
    this.AUDIO_PATHS = this.defineAudioPaths();
    this.isGameMuted = JSON.parse(localStorage.getItem('gameSoundMuted') || 'true');
    this.isMusicPlaying = false;
    this.audioPool = {};
    this.backgroundMusic = this.createAudioInstance(this.AUDIO_PATHS.BACKGROUND, 0.1);
    this.characterSnoringSound = null;
  }

  /**
   * Sets up initial game state.
   */
  setupGame() {
    this.preloadFrequentSounds();
    this.updateAllButtons();
    if (!this.isGameMuted) setTimeout(() => this.playBackgroundMusic(), 500);
  }

  /**
   * Initializes all AudioManager.
   */
  initialize() {
    this.initProperties();
    this.setupGame();
  }

  /**
   * Defines all audio file paths.
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
    [this.AUDIO_PATHS.COIN_COLLECT, this.AUDIO_PATHS.BOTTLE_COLLECT,
     this.AUDIO_PATHS.CHARACTER_HURT, this.AUDIO_PATHS.CHICKEN_HURT,
     this.AUDIO_PATHS.SMALL_CHICKEN_HURT, this.AUDIO_PATHS.ENDBOSS_HURT]
      .forEach(path => this.createAudioPool(path, 3));
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
   * Saves current sound state to localStorage.
   */
  saveSoundState() {
    localStorage.setItem('gameSoundMuted', JSON.stringify(this.isGameMuted));
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

  /**
   * Starts background music playback.
   */
  playBackgroundMusic() {
    if (this.isGameMuted) return;
    this.backgroundMusic.play().catch(() => {});
    this.isMusicPlaying = true;
  }

  /**
   * Stops background music playback.
   */
  stopBackgroundMusic() {
    this.stopAudio(this.backgroundMusic);
    this.isMusicPlaying = false;
  }

  /**
   * Plays character snoring sound if not muted.
   */
  playCharacterSnoring() {
    if (this.isGameMuted) return;
    if (!this.characterSnoringSound) {
      this.characterSnoringSound = this.createAudioInstance(this.AUDIO_PATHS.CHARACTER_SNORING, 0.9);
      this.characterSnoringSound.loop = true;
    }
    this.characterSnoringSound.play().catch(() => {});
  }

  /**
   * Stops character snoring sound.
   */
  stopCharacterSnoring() {
    this.stopAudio(this.characterSnoringSound);
  }

  /**
   * Plays endboss attack music in the given world.
   * @param {Object} world
   */
  playEndbossAttackMusic(world) {
    if (world.endbossAttackMusic || this.isGameMuted) return;
    world.endbossAttackMusic = this.createAudioInstance(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.5);
    world.endbossAttackMusic.loop = true;
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

  /**
   * Plays hurt sound based on enemy type.
   * @param {Object} enemy
   */
  playEnemyHurtSound(enemy) {
    const path = enemy.constructor.name === 'SmallChicken'
      ? this.AUDIO_PATHS.SMALL_CHICKEN_HURT
      : this.AUDIO_PATHS.CHICKEN_HURT;
    this.playSound(path);
  }

  /**
   * Mutes all endboss-related sounds.
   * @param {Object} endboss
   */
  muteEndbossSounds(endboss) {
    ['alert_sound', 'hurt_sound', 'dead_sound'].forEach(sound => 
      endboss?.[sound]?.pause()
    );
  }

  /**
   * Mutes all sounds in the current game world.
   * @param {Object} world
   */
  muteGameSounds(world) {
    if (!world?.level) return;
    const { level, character } = world;
    character?.hurt_sound?.pause();
    this.stopCharacterSnoring();
    level.enemies?.forEach(item => item?.chicken_sound?.pause());
    level.endboss?.forEach(endboss => this.muteEndbossSounds(endboss));
  }

  /**
   * Sets mute state.
   * @param {boolean} muted - Mute state.
   */
  setMuteState(muted) {
    this.isGameMuted = isGameMuted = muted;
  }

  /**
   * Saves state to localStorage.
   */
  saveState() {
    localStorage.setItem('gameSoundMuted', JSON.stringify(this.isGameMuted));
  }

  /**
   * Sets game mute state and saves it.
   * @param {boolean} muted - Mute state.
   */
  setGameMuteState(muted) {
    this.setMuteState(muted);
    this.saveState();
  }

  /**
   * Handles snoring for sleeping character.
   * @param {Object} world
   */
  handleSnoring(world) {
    if (world?.character?.currentState === "sleeping") this.playCharacterSnoring();
  }

  /**
   * Enables all game sounds.
   * @param {Object} world
   */
  enableAllSounds(world) {
    this.setGameMuteState(false);
    this.playBackgroundMusic();
    this.handleSnoring(world);
    this.updateAllButtons();
  }

  /**
   * Stops all game sounds.
   * @param {Object} world
   */
  stopAllSounds(world) {
    this.stopBackgroundMusic();
    this.muteGameSounds(world);
    this.stopEndbossAttackMusic(world);
  }

  /**
   * Disables all game sounds.
   * @param {Object} world
   */
  disableAllSounds(world) {
    this.setGameMuteState(true);
    this.stopAllSounds(world);
    this.updateAllButtons();
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
  }

  /**
   * Updates sound button text.
   */
  updateSoundButton() {
    const button = document.getElementById("music-toggle-button");
    if (button) {
      button.innerText = this.isGameMuted ? "Sound: Off" : "Sound: On";
      button.blur();
    }
  }

  /**
   * Updates menu button text.
   */
  updateMenuButton() {
    const menu = document.getElementById('btnSound');
    if (menu) menu.innerText = this.isGameMuted ? 'Turn On Sounds' : 'Turn Off Sounds';
  }

  /**
   * Updates audio icon image.
   */
  updateAudioIcon() {
    const icon = document.getElementById("audio-icon");
    if (icon) {
      icon.src = this.isGameMuted 
        ? "img_pollo_locco/img/10_buttons/sound-icon-off.png"
        : "img_pollo_locco/img/10_buttons/sound-icon-on.png";
    }
  }

  /**
   * Updates all audio-related UI buttons.
   */
  updateAllButtons() {
    this.updateSoundButton();
    this.updateMenuButton();
    this.updateAudioIcon();
  }

  // Sound effect methods
  /** @description Plays new life sound. */
  playNewLifeSound() { this.playSound(this.AUDIO_PATHS.NEW_LIFE); }
  
  /** @description Plays character hurt sound. */
  playCharacterHurtSound() { this.playSound(this.AUDIO_PATHS.CHARACTER_HURT); }
  
  /** @description Plays coin collect sound. */
  playCoinCollectSound() { this.playSound(this.AUDIO_PATHS.COIN_COLLECT); }
  
  /** @description Plays bottle collect sound. */
  playBottleCollectSound() { this.playSound(this.AUDIO_PATHS.BOTTLE_COLLECT); }
  
  /** @description Plays game over sound. */
  playGameOverSound() { this.playSound(this.AUDIO_PATHS.LOSE_GAME); }
  
  /** @description Plays game won sound. */
  playGameWonSound() { this.playSound(this.AUDIO_PATHS.WIN_GAME); }
  
  /** @description Plays endboss hurt sound. */
  playEndbossHurtSound() { this.playSound(this.AUDIO_PATHS.ENDBOSS_HURT, 0.3); }
  
  /** @description Plays endboss attack sound. */
  playEndbossAttackSound() { this.playSound(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.4); }
}

/**
 * Global instance of the AudioManager.
 * @type {AudioManager}
 */
const audioManager = new AudioManager();

// Synchronize global variable on page load
document.addEventListener('DOMContentLoaded', function() {
  isGameMuted = audioManager.isGameMuted;
  audioManager.updateAllButtons();
});