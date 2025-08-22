/**
 * Global mute state flag for the game.
 * @type {boolean}
 */
let isGameMuted = true;

/**
 * Manages all audio functionalities in the game.
 */
class AudioManager {
  /**
   * Creates AudioManager instance.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Initializes AudioManager properties.
   */
  initProperties() {
    this.AUDIO_PATHS = this.defineAudioPaths();
    this.isGameMuted = JSON.parse(localStorage.getItem('gameSoundMuted') || 'true');
    this.audioPool = {};
    this.backgroundMusic = this.createAudioInstance(this.AUDIO_PATHS.BACKGROUND, 0.1);
    this.characterSnoringSound = null;
    this.endGameAudio = null; 
  }

  /**
   * Sets up initial game state.
   */
  setupGame() {
    this.preloadFrequentSounds();
    this.updateAllButtons();
  }

  /**
   * Initializes all AudioManager components.
   */
  initialize() {
    this.initProperties();
    this.setupGame();
  }

  /**
   * Defines all audio file paths.
   * @returns {Object<string, string>} Audio file paths
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
      this.AUDIO_PATHS.COIN_COLLECT, this.AUDIO_PATHS.BOTTLE_COLLECT,
      this.AUDIO_PATHS.CHARACTER_HURT, this.AUDIO_PATHS.CHICKEN_HURT,
      this.AUDIO_PATHS.SMALL_CHICKEN_HURT, this.AUDIO_PATHS.ENDBOSS_HURT
    ];
    frequentSounds.forEach(path => this.createAudioPool(path, 3));
  }

  /**
   * Creates a pool of audio instances for a given sound.
   * @param {string} path - Audio file path
   * @param {number} poolSize - Number of instances in pool
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
   * @param {string} path - Path to audio file
   * @param {number} volume - Initial volume level
   * @returns {HTMLAudioElement} Audio element
   */
  createAudioInstance(path, volume) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.preload = 'auto';
    return audio;
  }

  /**
   * Plays sound using pool if available.
   * @param {string} path - Audio file path
   * @param {number} volume - Volume level (default: 0.2)
   */
  playSound(path, volume = 0.2) {
    if (this.isGameMuted) return;
    
    const pool = this.audioPool[path];
    if (pool) {
      this.playPooledSound(pool, volume);
    } else {
      this.playDirectSound(path, volume);
    }
  }

  /**
   * Plays sound from audio pool.
   * @param {Object} pool - Audio pool object
   * @param {number} volume - Volume level
   */
  playPooledSound(pool, volume) {
    const audio = pool.instances[pool.currentIndex];
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
  }

  /**
   * Plays sound directly without pool.
   * @param {string} path - Audio file path
   * @param {number} volume - Volume level
   */
  playDirectSound(path, volume) {
    const audio = this.createAudioInstance(path, volume);
    audio.play().catch(() => {});
  }

  /**
   * Stops and resets audio instance.
   * @param {HTMLAudioElement} audio - Audio element to stop
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
  }

  /**
   * Stops background music playback.
   */
  stopBackgroundMusic() {
    this.stopAudio(this.backgroundMusic);
  }

  /**
   * Plays character snoring sound if not muted.
   */
  playCharacterSnoring() {
    if (this.isGameMuted) return;
    if (!this.characterSnoringSound) {
      this.initializeSnoringSound();
    }
    this.characterSnoringSound.play().catch(() => {});
  }

  /**
   * Initializes character snoring sound.
   */
  initializeSnoringSound() {
    this.characterSnoringSound = this.createAudioInstance(this.AUDIO_PATHS.CHARACTER_SNORING, 0.9);
    this.characterSnoringSound.loop = true;
  }

  /**
   * Stops character snoring sound.
   */
  stopCharacterSnoring() {
    this.stopAudio(this.characterSnoringSound);
  }

  /**
   * Plays endboss attack music in given world.
   * @param {Object} world - Game world object
   */
  playEndbossAttackMusic(world) {
    if (world.endbossAttackMusic || this.isGameMuted) return;
    world.endbossAttackMusic = this.createAudioInstance(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.5);
    world.endbossAttackMusic.loop = true;
    world.endbossAttackMusic.play().catch(() => {});
  }

  /**
   * Stops endboss attack music.
   * @param {Object} world - Game world object
   */
  stopEndbossAttackMusic(world) {
    if (!world?.endbossAttackMusic) return;
    this.stopAudio(world.endbossAttackMusic);
    world.endbossAttackMusic = null;
    world.endbossAttackStarted = false;
  }

  /**
   * Plays hurt sound based on enemy type.
   * @param {Object} enemy - Enemy object
   */
  playEnemyHurtSound(enemy) {
    const path = enemy.constructor.name === 'SmallChicken'
      ? this.AUDIO_PATHS.SMALL_CHICKEN_HURT
      : this.AUDIO_PATHS.CHICKEN_HURT;
    this.playSound(path);
  }

  /**
   * Mutes all endboss-related sounds.
   * @param {Object} endboss - Endboss object
   */
  muteEndbossSounds(endboss) {
    const sounds = ['alert_sound', 'hurt_sound', 'dead_sound'];
    sounds.forEach(sound => endboss?.[sound]?.pause());
  }

  /**
   * Mutes all sounds in current game world.
   * @param {Object} world - Game world object
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
   * @param {boolean} muted - Mute state
   */
  setMuteState(muted) {
    this.isGameMuted = isGameMuted = muted;
  }

  /**
   * Sets game mute state and saves it.
   */
  setGameMuteState(muted) {
    this.setMuteState(muted);
    localStorage.setItem('gameSoundMuted', JSON.stringify(this.isGameMuted));
  }

  /**
   * Handles snoring for sleeping character.
   */
  handleSnoring(world) {
    if (world?.character?.currentState === "sleeping") this.playCharacterSnoring();
  }

  /**
   * Enables all game sounds.
   */
  enableAllSounds(world) {
    this.setGameMuteState(false);
    this.playBackgroundMusic();
    this.handleSnoring(world);
    this.updateAllButtons();
  }

  /**
   * Stops all game sounds.
   */
  stopAllSounds(world) {
    this.stopBackgroundMusic();
    this.muteGameSounds(world);
    this.stopEndbossAttackMusic(world);
    this.stopEndGameAudio();
  }

  /**
   * Stops end game audio if playing.
   */
  stopEndGameAudio() {
    if (this.endGameAudio) {
      this.stopAudio(this.endGameAudio);
      this.endGameAudio = null;
    }
  }

  /**
   * Disables all game sounds.
   */
  disableAllSounds(world) {
    this.setGameMuteState(true);
    this.stopAllSounds(world);
    this.updateAllButtons();
  }

  /**
   * Stops all game-related end sounds.
   */
  stopAllGameEndSounds(world) {
    this.stopCharacterSnoring();
    this.stopEndbossAttackMusic(world);
    this.stopBackgroundMusic();
    this.stopEndGameAudio();
  }

  /**
   * Toggles sound on or off.
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

  /**
   * Creates and plays end game audio.
   */
  createAndPlayEndGameAudio(audioPath) {
    this.endGameAudio = this.createAudioInstance(audioPath, 0.2);
    if (!this.isGameMuted) this.endGameAudio.play().catch(() => {});
  }

  // Sound effect methods
  playNewLifeSound() { this.playSound(this.AUDIO_PATHS.NEW_LIFE); }
  playCharacterHurtSound() { this.playSound(this.AUDIO_PATHS.CHARACTER_HURT); }
  playCoinCollectSound() { this.playSound(this.AUDIO_PATHS.COIN_COLLECT); }
  playBottleCollectSound() { this.playSound(this.AUDIO_PATHS.BOTTLE_COLLECT); }
  playEndbossHurtSound() { this.playSound(this.AUDIO_PATHS.ENDBOSS_HURT, 0.3); }
  playEndbossAttackSound() { this.playSound(this.AUDIO_PATHS.ENDBOSS_ATTACK, 0.4); }
  playGameOverSound() { this.createAndPlayEndGameAudio(this.AUDIO_PATHS.LOSE_GAME); }
  playGameWonSound() { this.createAndPlayEndGameAudio(this.AUDIO_PATHS.WIN_GAME); }
}

const audioManager = new AudioManager();

/**
 * Handles DOM content loaded event for audio initialization.
 */
document.addEventListener('DOMContentLoaded', function() {
  isGameMuted = audioManager.isGameMuted;
  audioManager.updateAllButtons();
});