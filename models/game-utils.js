export function showGameOver(world) {
    document.querySelectorAll('.game-over-screen').forEach(e => e.remove());

    if (world.gameOver) return;
    hideFooterButtonsAtEnd();
    world.gameOver = true;
    clearInterval(world.gameInterval);
    world.character.muteSnoringSound();
    if (world.endbossAttackMusic) {
        world.endbossAttackMusic.pause();
        world.endbossAttackMusic.currentTime = 0;
        world.endbossAttackMusic = null;
    }
    stopBackgroundMusic();
    document.getElementById("canvas").style.display = "none";
    document.getElementById("titleCanvas").style.display = "none";
    const gameOverScreen = document.createElement("div");
    gameOverScreen.classList.add("game-over-screen");
    const gameOverImage = document.createElement("img");
    gameOverImage.src =
    "img_pollo_locco/img/9_intro_outro_screens/game_over/oh no you lost!.png";
    gameOverScreen.appendChild(gameOverImage);
    document.body.appendChild(gameOverScreen);
    document.querySelector("footer").style.display = "flex";
    if (!isGameMuted) playSound("audio/lose-game-sound.mp3");
}

  
  export function showGameWon(world) {
    document.querySelectorAll('.game-over-screen').forEach(e => e.remove());
    hideFooterButtonsAtEnd();
    let gameWonScreen = document.getElementById("game-won-screen");
    clearInterval(world.gameInterval);
    if (world.character) {
      world.character.muteSnoringSound();
    }
    if (world.endbossAttackMusic) {
      world.endbossAttackMusic.pause();
      world.endbossAttackMusic.currentTime = 0;
      world.endbossAttackMusic = null;
    }
    stopBackgroundMusic();
    if (!gameWonScreen) {
      gameWonScreen = document.createElement("div");
      gameWonScreen.id = "game-won-screen";
      gameWonScreen.classList.add("game-won-screen");
      const gameWonText = document.createElement("h1");
      gameWonText.textContent = "You Won!";
      gameWonScreen.appendChild(gameWonText);
      document.body.appendChild(gameWonScreen);
     if (!isGameMuted) playSound("audio/winning-game-sound.mp3");
    }
  }
  
  export function checkGameEnd(world) {
    const endboss = world.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (world.character.isDead()) {
      showGameOver(world);
    } else if (endboss && endboss.isEnemyDead()) {
      showGameWon(world);
    }
  }