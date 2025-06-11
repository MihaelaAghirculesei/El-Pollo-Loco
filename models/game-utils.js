const SELECTORS = {
  GAME_OVER_SCREEN: '.game-over-screen',
  CANVAS: '#canvas',
  TITLE_CANVAS: '#titleCanvas',
  FOOTER: 'footer',
  GAME_WON_SCREEN: '#game-won-screen'
};

const GAME_OVER_IMAGE_PATH = 'img_pollo_locco/img/9_intro_outro_screens/game_over/oh no you lost!.png';

function handleGameEnd(world) {
  if (world.gameOver) return false;
  hideFooterButtonsAtEnd();
  world.gameOver = true;
  clearInterval(world.gameInterval);
  stopAllGameEndSounds(world);
  return true;
}

function hideCanvases() {
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('titleCanvas').style.display = 'none';
}

function removeExistingScreens() {
  document.querySelectorAll(SELECTORS.GAME_OVER_SCREEN).forEach(screen => screen.remove());
}

function showFooter() {
  document.querySelector(SELECTORS.FOOTER).style.display = 'flex';
}

function createScreenElement(className, id = null) {
  const screen = document.createElement('div');
  screen.classList.add(className);
  if (id) screen.id = id;
  return screen;
}

function createGameOverImage() {
  const image = document.createElement('img');
  image.src = GAME_OVER_IMAGE_PATH;
  image.alt = 'Game Over';
  return image;
}

function displayGameOverScreen() {
  const screen = createScreenElement('game-over-screen');
  const image = createGameOverImage();
  screen.appendChild(image);
  document.body.appendChild(screen);
}

function displayGameWonScreen() {
  let screen = document.querySelector(SELECTORS.GAME_WON_SCREEN);

  if (!screen) {
    screen = createScreenElement('game-won-screen', 'game-won-screen');
    const text = document.createElement('h1');
    text.textContent = 'You Won!';
    screen.appendChild(text);
    document.body.appendChild(screen);
    playGameWonSound();
  }

  screen.style.display = 'flex';
}

function prepareGameEndUI() {
  removeExistingScreens();
  hideCanvases();
  showFooter();
}

export function showGameOver(world) {
  removeExistingScreens();
  if (!handleGameEnd(world)) return;
  hideCanvases();
  displayGameOverScreen();
  showFooter();
  playGameOverSound();
}

export function showGameWon(world) {
  removeExistingScreens();
  hideFooterButtonsAtEnd();
  window.showFooterOnGameEnd();
  clearInterval(world.gameInterval);
  stopAllGameEndSounds(world);
  displayGameWonScreen();
}

export function checkGameEnd(world) {
  const endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
  if (world.character.isDead()) {
    showGameOver(world);
  } else if (endboss?.isEnemyDead()) {
    showGameWon(world);
  }
}
