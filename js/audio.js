let backgroundMusic = new Audio("audio/game.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
let gameWon = new Audio("audio/winning-game-sound.mp3");
let gameLost = new Audio("audio/lose-game-sound.mp3");
let endbossHurt = new Audio("audio/endboss-hurt.mp3");
let bottleCollect = new Audio("audio/bottle-collect-sound.mp3");
let coinsCollect = new Audio("audio/coin-collect-sound.mp3");

let isGameMuted = true;
let backgroundMusicMuted = false;
backgroundMusic.loop = true;
let isMusicPlaying = false;
let audioInstances = {};

function gameWonSound() {
  muteSnoringSound();
  if (!isGameMuted) {
    playSound("audio/winning-game-sound.mp3");
  }
}

function gameLostSound() {
  muteSnoringSound();
  if (!isGameMuted) {
    gameLost.play("audio/lose-game-sound.mp3");
  }
}

function playBackgroundMusic() {
  backgroundMusic.volume = 0.1;
  backgroundMusic.muted = backgroundMusicMuted;
  backgroundMusic.loop = true;
  backgroundMusic.play();
  isMusicPlaying = true;
}

function playSound(soundFilePath, volume = 0.2) {
  if (!audioInstances[soundFilePath]) {
    let audio = new Audio(soundFilePath);
    audio.volume = volume;
    audioInstances[soundFilePath] = audio;
  }

  audioInstances[soundFilePath].currentTime = 0;
  audioInstances[soundFilePath].play();
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  isMusicPlaying = false;
}

function toggleSound(world) {
  let musicToggleButton = document.getElementById("music-toggle-button");
  if (!isGameMuted) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    isMusicPlaying = false;
    musicToggleButton.innerText = "Sound: Off";
    muteAllSounds(world);
    isGameMuted = true;
  } else {
    if (!isMusicPlaying) {
      backgroundMusic.play();
      isMusicPlaying = true;
      if(world && world.character) {
        world.character.playSnoringSound();
      }
      isMusicPlaying = true;
    }
    musicToggleButton.innerText = "Sound: On";
    isGameMuted = false;
  }
}

function toggleSoundForBackgroundMusic() {
  isGameMuted = !isGameMuted;
  updateSoundStatus();
  muteSounds();
}

function muteSounds() {
  let allSounds = document.querySelectorAll("audio");
  allSounds.forEach((sound) => {
    sound.pause();
  });
}

function muteAllSounds(world) {
  muteBottleSounds(world);
  muteCharacterSounds(world);
  muteChickenSounds(world);
  muteEndbossSounds(world);
  muteCoinSounds(world);
  muteSnoringSound(world);
}

function muteChickenSounds(world) {
  if (world && world.level && world.level.enemies) {
    world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken) {
      }
    });
  }
}

function muteEndbossSounds(world) {
  if (world && world.level && world.level.endboss) {
    world.level.endboss.forEach((endboss) => {
      endboss.alert_sound.pause();
      endboss.hurt_sound.pause();
      endboss.dead_sound.pause();
    });
  }
}

function muteCoinSounds(world) {
  if (world && world.level && world.level.coins) {
    world.level.coins.forEach((coin) => {
      coin.collect_sound.pause();
    });
  }
}

function muteBottleSounds(world) {
  if (world && world.level && world.level.bottle) {
    world.level.bottle.forEach((bottle) => {
      bottle.collect_sound.pause();
    });
  }
}

function muteSingleBottleSounds(bottle) {
  bottle.collect_sound.pause();
}

function muteCharacterSounds(world) {
  if (world && world.character) {
    world.character.hurt_sound.pause();
  }
}

function muteSnoringSound(world) {
  if (world && world.character) {
    world.character.muteSnoringSound();
  }
}

document
  .getElementById("music-toggle-button")
  .addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
    }
  });
