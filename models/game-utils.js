export function showGameOver(world) {
    if (world.gameOver) return;
    world.gameOver = true;
    clearInterval(world.gameInterval);
    if (!isGameMuted) {
      toggleSound();
    }
    world.character.muteSnoringSound();
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
    playSound("audio/lose-game-sound.mp3");
  }
  
  export function showGameWon(world) {
    let gameWonScreen = document.getElementById("game-won-screen");
    clearInterval(world.gameInterval);
    if (!isGameMuted) {
      toggleSound();
    }
    if (world.character) {
      world.character.muteSnoringSound();
    }
    if (!gameWonScreen) {
      gameWonScreen = document.createElement("div");
      gameWonScreen.id = "game-won-screen";
      gameWonScreen.classList.add("game-won-screen");
      const gameWonText = document.createElement("h1");
      gameWonText.textContent = "You Won!";
      gameWonScreen.appendChild(gameWonText);
      document.body.appendChild(gameWonScreen);
      playSound("audio/winning-game-sound.mp3");
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