
let backgroundMusic = new Audio('audio/game.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; 
let gameWon = new Audio('audio/winning-game-sound.mp3');
let gameLost = new Audio('audio/lose-game-sound.mp3');
let endbossHurt = new Audio('audio/endboss-hurt.mp3');

// let characterHurt = new Audio('audio/character-hurt-sound.mp3');


// let bottleCollect = new Audio('audio/bottle-collect-sound.mp3');

// let characterCoinCollect = new Audio('audio/coin-collect-sound.mp3');

// let characterWalking = new Audio('audio/character-walking-sound.mp3');


// let chickenHurt = new Audio('audio/chicken-hurt.mp3'); 

// let endbossHurt = new Audio('audio/endboss-hurt.mp3');

// let  endbossAtack = new Audio('audio/endboss-atack.mp3');

let isGameMuted = false;
let backgroundMusicMuted = false;
backgroundMusic.loop = true;
let isMusicPlaying = false;
let audioInstances = {};

function gameWonSound() {
    if (!isGameMuted) {
        playSound('audio/winning-game-sound.mp3');
    }
}

function gameLostSound() {
    if (!isGameMuted) {
        gameLost.play();
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
    // Suche, ob der Sound bereits erstellt wurde
    if (!audioInstances[soundFilePath]) {
        let audio = new Audio(soundFilePath);
        audio.volume = volume;
        audioInstances[soundFilePath] = audio;
    }

    // Setze die aktuelle Zeit des Audios zurück und spiele es ab
    audioInstances[soundFilePath].currentTime = 0;
    audioInstances[soundFilePath].play();
}

function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    isMusicPlaying = false;
}

function updateSoundStatus() {
    backgroundMusicMuted = !backgroundMusicMuted;
    backgroundMusic.muted = backgroundMusicMuted;
    let musicToggleButton = document.getElementById('music-toggle-button');
    let soundIcon = document.getElementById('sound-icon');
    if (backgroundMusicMuted) {
        musicToggleButton.innerText = 'Background Music: Off';
        stopBackgroundMusic();
    } else {
        musicToggleButton.innerText = 'Background Music: On';
        playBackgroundMusic();
    }
}

function toggleSound() {
    isGameMuted = !isGameMuted;
    
    let musicToggleButton2 = document.getElementById('music-toggle-button-2');

    if (isGameMuted) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        isMusicPlaying = false;
        musicToggleButton2.innerText = 'Mute: Off';
    } else {
        if (!isMusicPlaying) {
            backgroundMusic.play();
            isMusicPlaying = true;
        }
        musicToggleButton2.innerText = 'Mute: On';
    }
}

function toggleSoundForBackgroundMusic() {
    isGameMuted = !isGameMuted;
    updateSoundStatus();
    muteSounds();
}

function muteSounds() {
    let allSounds = document.querySelectorAll('audio'); // Alle <audio>-Elemente holen
    allSounds.forEach(sound => {
        sound.muted = isGameMuted; // Alle Sounds muten oder entmuten
    });
}

function muteChickenSounds() {
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken) {
                endbossHurt.muted = isGameMuted;
            }
        });
    }
}

function muteEndbossSounds() {
    if (world && world.level && world.level.endboss) {
        world.level.endboss.forEach((endboss) => {
            endboss.alert_sound.muted = isGameMuted;
            endboss.hurt_sound.muted = isGameMuted;
            endboss.dead_sound.muted = isGameMuted;
        });
    }
}

function muteCoinSounds() {
    if (world && world.level && world.level.coins) {
        world.level.coins.forEach((coin) => {
            coin.collect_sound.muted = isGameMuted;
        });
    }
}

function muteBottleSounds() {
    if (world && world.level && world.level.bottles) {
        world.level.bottles.forEach((bottle) => {
            bottle.collect_sound.muted = isGameMuted;
        });
    }
}

function muteSingleBottleSounds(bottle) {
    bottle.collect_sound.muted = isGameMuted;
}
function muteCharacterSounds() {
    if (world && world.character) {
        world.character.hurt_sound.muted = isGameMuted;
    }

}

function toggleAllSounds() {
    isGameMuted = !isGameMuted; // Wechselt zwischen Stumm und Laut

    // Hintergrundmusik muten oder wieder abspielen
    if (backgroundMusic) {
        backgroundMusic.muted = isGameMuted;
    }
    // Alle anderen Sounds muten
    muteSounds();

    // Aktualisiere den Button-Text
    let soundToggleButton = document.getElementById('music-toggle-button');
    if (soundToggleButton) {
        soundToggleButton.innerText = isGameMuted ? 'Sound: Off' : 'Sound: On';
    }
}