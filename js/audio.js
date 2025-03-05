
let backgroundMusic = new Audio('audio/game.mp3');

let gameWon = new Audio('audio/winning-game-sound.mp3');

let gameLost = new Audio('audio/lose-game-sound.mp3');

let isGameMuted = false;

let backgroundMusicMuted = false;

function gameWonSound() {
    if (!isGameMuted) {
        gameWon.play();
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
    backgroundMusic.play();
}

function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function updateSoundStatus() {
    backgroundMusicMuted = !backgroundMusicMuted;
    backgroundMusic.muted = backgroundMusicMuted;
    let musicToggleButton = document.getElementById('music-toggle-button');
    let soundIcon = document.getElementById('sound-icon');
    if (backgroundMusicMuted) {
        musicToggleButton.innerText = 'Sound Off';
        soundIcon.src = './img/12_icons/SOUND_OFF_icon.png';
    } else {
        musicToggleButton.innerText = 'Sound On';
        soundIcon.src = './img/12_icons/SOUND_ON_icon.png';
    }
    if (gameActive) {
        muteSounds();
    }
}

function toggleSoundAndImage() {
    isGameMuted = !isGameMuted;
    updateSoundStatus();
    muteSounds();
}

function muteSounds() {
    if (backgroundMusic) {
        backgroundMusic.muted = isGameMuted;
    }
    muteChickenSounds();
    muteCharacterSounds();
    muteEndbossSounds();
}

function muteChickenSounds() {
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken) {
                enemy.death_sound.muted = isGameMuted;
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
        world.character.walking_sound.muted = isGameMuted;
        world.character.hurt_sound.muted = isGameMuted;
    }

}
