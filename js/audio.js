const backgroundMusic = new Audio("audio/game.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const audioInstances = {};
let isGameMuted = true;
let backgroundMusicMuted = false;
let isMusicPlaying = false;

const AUDIO_PATHS = {
  CHARACTER_HURT: "audio/character-hurt-sound.mp3",
  CHICKEN_HURT: "audio/chicken-hurt.mp3",
  SMALL_CHICKEN_HURT: "audio/small-chicken-hurt.mp3",
  NEW_LIFE: "audio/new-life.mp3",
  ENDBOSS_ATTACK: "audio/endboss-atack.mp3"
};

function createAudioInstance(path, volume = 0.2) {
  if (!audioInstances[path]) {
    audioInstances[path] = new Audio(path);
    audioInstances[path].volume = volume;
  }
  return audioInstances[path];
}

function playAudioInstance(path, volume = 0.2) {
  const audio = createAudioInstance(path, volume);
  audio.currentTime = 0;
  audio.play();
}

function playSound(path, volume = 0.2) {
  if (!isGameMuted) {
    playAudioInstance(path, volume);
  }
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

function stopAudio(audio) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function muteSound(object, property) {
  if (object && object[property]) {
    object[property].pause();
  }
}

function muteArraySounds(array, property) {
  if (array) {
    array.forEach(function(item) {
      muteSound(item, property);
    });
  }
}

function muteGameSounds(world) {
  const level = world ? world.level : null;
  const character = world ? world.character : null;
  
  muteArraySounds(level?.bottle, "collect_sound");
  muteArraySounds(level?.coins, "collect_sound");
  muteSound(character, "hurt_sound");
  
  if (character && character.muteSnoringSound) {
    character.muteSnoringSound();
  }
  
  muteArraySounds(level?.enemies, "chicken_sound");
  
  if (level && level.endboss) {
    level.endboss.forEach(function(endboss) {
      muteSound(endboss, "alert_sound");
      muteSound(endboss, "hurt_sound");
      muteSound(endboss, "dead_sound");
    });
  }
}

function muteAllSounds(world) {
  muteGameSounds(world);
}

function playEndbossAttackMusic(world) {
  if (world.endbossAttackMusic || isGameMuted) return;
  
  world.endbossAttackMusic = new Audio(AUDIO_PATHS.ENDBOSS_ATTACK);
  world.endbossAttackMusic.loop = true;
  world.endbossAttackMusic.volume = 0.5;
  world.endbossAttackMusic.play();
}

function stopEndbossAttackMusic(world) {
  if (world && world.endbossAttackMusic) {
    stopAudio(world.endbossAttackMusic);
    world.endbossAttackMusic = null;
    world.endbossAttackStarted = false;
  }
}

function playWorldSound(path, volume = 0.2, currentSounds = {}) {
  if (isGameMuted || currentSounds[path]) return;
  
  const sound = new Audio(path);
  sound.volume = volume;
  sound.play();
  currentSounds[path] = sound;
  
  sound.onended = function() {
    delete currentSounds[path];
  };
}

function playNewLifeSound() {
  playSound(AUDIO_PATHS.NEW_LIFE);
}

function getEnemyHurtSound(enemy) {
  const enemyType = enemy.constructor.name;
  return enemyType === 'SmallChicken' ? AUDIO_PATHS.SMALL_CHICKEN_HURT : AUDIO_PATHS.CHICKEN_HURT;
}

function playEnemyHurtSound(enemy) {
  const soundPath = getEnemyHurtSound(enemy);
  playSound(soundPath);
}

function playCharacterHurtSound() {
  playSound(AUDIO_PATHS.CHARACTER_HURT);
}

function enableAllSounds(world) {
  if (!isMusicPlaying) {
    playBackgroundMusic();
    if (world && world.character && world.character.playSnoringSound) {
      world.character.playSnoringSound();
    }
  }
}

function disableAllSounds(world) {
  stopBackgroundMusic();
  muteAllSounds(world);
  stopEndbossAttackMusic(world);
}

function updateSoundButton(isEnabled) {
  const button = document.getElementById("music-toggle-button");
  if (button) {
    button.innerText = isEnabled ? "Sound: On" : "Sound: Off";
    button.blur();
  }
}

function toggleSound(world) {
  if (!isGameMuted) {
    disableAllSounds(world);
  } else {
    enableAllSounds(world);
  }
  
  isGameMuted = !isGameMuted;
  updateSoundButton(!isGameMuted);
}