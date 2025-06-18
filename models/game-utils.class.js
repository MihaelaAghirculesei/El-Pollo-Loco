const SELECTORS = {
  GAME_OVER_SCREEN: '.game-over-screen',
  CANVAS: '#canvas',
  TITLE_CANVAS: '#titleCanvas',
  FOOTER: 'footer',
  GAME_WON_SCREEN: '#game-won-screen'
};

const GAME_OVER_IMAGE_PATH = 'img_pollo_locco/img/9_intro_outro_screens/game_over/oh no you lost!.png';

function setGameOverState(world) {
  world.gameOver = true;
  clearInterval(world.gameInterval);
}

function hideCanvases() {
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('titleCanvas').style.display = 'none';
}

function removeExistingScreens() {
  document.querySelectorAll(SELECTORS.GAME_OVER_SCREEN).forEach(screen => screen.remove());
}

function showFooter() {
  const footer = document.querySelector(SELECTORS.FOOTER);
  if (footer) footer.style.display = 'flex';
}

function createGameOverScreen() {
  const screen = document.createElement('div');
  screen.classList.add('game-over-screen');
  
  const image = document.createElement('img');
  image.src = GAME_OVER_IMAGE_PATH;
  image.alt = 'Game Over';
  
  screen.appendChild(image);
  document.body.appendChild(screen);
}

function createGameWonScreen() {
  let screen = document.querySelector(SELECTORS.GAME_WON_SCREEN);
  
  if (!screen) {
    screen = document.createElement('div');
    screen.classList.add('game-won-screen');
    screen.id = 'game-won-screen';
    
    const text = document.createElement('h1');
    text.textContent = 'You Won!';
    
    screen.appendChild(text);
    document.body.appendChild(screen);
    playGameWonSound();
  }
  
  screen.style.display = 'flex';
}

function handleGameOverFlow(world) {
  if (world?.gameOver) return false;
  
  hideFooterButtonsAtEnd();
  setGameOverState(world);
  return true;
}

function executeGameOverSequence(world) {
  stopAllGameEndSounds(world);
  hideCanvases();
  createGameOverScreen();
  showFooter();
  playGameOverSound();
}

function handleGameWonFlow(world) {
  hideFooterButtonsAtEnd();
  window.showFooterOnGameEnd();
  clearInterval(world.gameInterval);
  stopAllGameEndSounds(world);
  createGameWonScreen();
}

function findEndboss(world) {
  return world?.level?.enemies?.find(enemy => enemy instanceof Endboss);
}

function showGameOver(world) {
  if (!world) return;
  
  removeExistingScreens();
  if (!handleGameOverFlow(world)) return;
  executeGameOverSequence(world);
}

function showGameWon(world) {
  if (!world) return;
  
  removeExistingScreens();
  handleGameWonFlow(world);
}

function checkGameEnd(world) {
  if (!world) return;
  
  const endboss = findEndboss(world);
  if (world.character?.isDead()) {
    showGameOver(world);
  } else if (endboss?.isEnemyDead()) {
    showGameWon(world);
  }
}