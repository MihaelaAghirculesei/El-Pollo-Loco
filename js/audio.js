const backgroundMusic = new Audio("audio/game.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const audioInstances = {};
let isGameMuted = true;
let backgroundMusicMuted = false;
let isMusicPlaying = false;

function playAudioInstance(path, volume = 0.2) {
  if (!audioInstances[path]) {
    const audio = new Audio(path);
    audio.volume = volume;
    audioInstances[path] = audio;
  }
  const audio = audioInstances[path];
  audio.currentTime = 0;
  audio.play();
}

function playBackgroundMusic() {
  backgroundMusic.volume = 0.1;
  backgroundMusic.muted = backgroundMusicMuted;
  backgroundMusic.loop = true;
  backgroundMusic.play();
  isMusicPlaying = true;
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  isMusicPlaying = false;
}

function muteAllAudioElements() {
  document.querySelectorAll("audio").forEach(a => a.pause());
}

function muteSound(obj, prop) {
  obj?.[prop]?.pause();
}

function muteArraySounds(arr, prop) {
  arr?.forEach(item => muteSound(item, prop));
}

function muteAllSounds(world) {
  const { level, character } = world || {};
  muteArraySounds(level?.bottle, 'collect_sound');
  muteSound(character, 'hurt_sound');
  muteArraySounds(level?.enemies, 'chicken_sound');
  level?.endboss?.forEach(e => ['alert_sound', 'hurt_sound', 'dead_sound'].forEach(s => muteSound(e, s)));
  muteArraySounds(level?.coins, 'collect_sound');
  character?.muteSnoringSound();
}

function gameWonSound() {
  muteSnoringSound();
  if (!isGameMuted) playAudioInstance("audio/winning-game-sound.mp3");
}

function gameLostSound() {
  muteSnoringSound();
  if (!isGameMuted) playAudioInstance("audio/lose-game-sound.mp3");
}

function playSound(path, volume = 0.2) {
  playAudioInstance(path, volume);
}

function toggleSound(world) {
  const btn = document.getElementById("music-toggle-button");
  if (!isGameMuted) {
    stopBackgroundMusic();
    muteAllSounds(world);
    stopEndbossAttackMusic(world);
    btn.innerText = "Sound: Off";
  } else {
    if (!isMusicPlaying) {
      playBackgroundMusic();
      world?.character?.playSnoringSound();
    }
    btn.innerText = "Sound: On";
  }
  isGameMuted = !isGameMuted;
  btn.blur();
}

function stopEndbossAttackMusic(world) {
  if (world?.endbossAttackMusic) {
    world.endbossAttackMusic.pause();
    world.endbossAttackMusic.currentTime = 0;
    world.endbossAttackMusic = null;
    world.endbossAttackStarted = false; 
  }
}
