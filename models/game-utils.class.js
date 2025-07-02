const SELECTORS = {
  GAME_OVER_SCREEN: '.game-over-screen',
  CANVAS: '#canvas',
  TITLE_CANVAS: '#titleCanvas',
  FOOTER: 'footer',
  GAME_WON_SCREEN: '#game-won-screen'
};

const GAME_OVER_IMAGE_PATH = 'img_pollo_locco/img/9_intro_outro_screens/game_over/oh no you lost!.png';

/**
 * Sets the game state to "game over" and stops the game loop.
 * @param {Object} world - The game world object containing state and intervals.
 */
function setGameOverState(world) {
  world.gameOver = true;
  clearInterval(world.gameInterval);
}

/**
 * Hides the main game canvas and the title canvas by setting their display style to 'none'.
 */
function hideCanvases() {
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('titleCanvas').style.display = 'none';
}

/**
 * Removes all existing game over screen elements from the DOM.
 */
function removeExistingScreens() {
  document.querySelectorAll(SELECTORS.GAME_OVER_SCREEN).forEach(screen => screen.remove());
}

/**
 * Displays the footer element by setting its display style to 'flex'.
 */
function showFooter() {
  const footer = document.querySelector(SELECTORS.FOOTER);
  if (footer) footer.style.display = 'flex';
}

/**
 * Creates and appends a game over screen element with an image to the document body.
 */
function createGameOverScreen() {
  const screen = document.createElement('div');
  screen.classList.add('game-over-screen');
  
  const image = document.createElement('img');
  image.src = GAME_OVER_IMAGE_PATH;
  image.alt = 'Game Over';
  
  screen.appendChild(image);
  document.body.appendChild(screen);
}

/**
 * Creates and shows the game won screen if it does not already exist, then plays the winning sound.
 */
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

/**
 * Handles the flow when the game is over; hides footer buttons, sets game over state, and prevents multiple triggers.
 * @param {Object} world - The game world object.
 * @returns {boolean} - Returns false if the game is already over, true otherwise.
 */
function handleGameOverFlow(world) {
  if (world?.gameOver) return false;
  
  hideFooterButtonsAtEnd();
  setGameOverState(world);
  return true;
}

/**
 * Executes the sequence of actions to display the game over state including stopping sounds, hiding canvases, showing screens, and playing sound.
 * @param {Object} world - The game world object.
 */
function executeGameOverSequence(world) {
  stopAllGameEndSounds(world);
  hideCanvases();
  createGameOverScreen();
  showFooter();
  playGameOverSound();
}

/**
 * Handles the flow when the game is won; hides footer buttons, shows footer, stops intervals and sounds, and creates the game won screen.
 * @param {Object} world - The game world object.
 */
function handleGameWonFlow(world) {
  hideFooterButtonsAtEnd();
  window.showFooterOnGameEnd();
  clearInterval(world.gameInterval);
  stopAllGameEndSounds(world);
  createGameWonScreen();
}

/**
 * Finds the endboss enemy within the current game level.
 * @param {Object} world - The game world object.
 * @returns {Object|undefined} - Returns the endboss enemy object if found, otherwise undefined.
 */
function findEndboss(world) {
  return world?.level?.enemies?.find(enemy => enemy instanceof Endboss);
}

/**
 * Initiates the game over display sequence if the game world is valid.
 * @param {Object} world - The game world object.
 */
function showGameOver(world) {
  if (!world) return;
  
  removeExistingScreens();
  if (!handleGameOverFlow(world)) return;
  executeGameOverSequence(world);
}

/**
 * Initiates the game won display sequence if the game world is valid.
 * @param {Object} world - The game world object.
 */
function showGameWon(world) {
  if (!world) return;
  
  removeExistingScreens();
  handleGameWonFlow(world);
}

/**
 * Checks if the game has ended by evaluating the character's death or the endboss's death, then triggers the appropriate end screen.
 * @param {Object} world - The game world object.
 */
function checkGameEnd(world) {
  if (!world) return;
  
  const endboss = findEndboss(world);
  if (world.character?.isDead()) {
    showGameOver(world);
  } else if (endboss?.isEnemyDead()) {
    showGameWon(world);
  }
}

/**
 * Plays a sound by path with optional volume.
 * @param {string} path - Audio file path.
 * @param {number} volume - Volume level.
 */
const playSound = (path, volume) => audioManager.playSound(path, volume);

/**
 * Plays character snoring sound.
 */
const playCharacterSnoringSound = () => audioManager.playCharacterSnoring();

/**
 * Stops character snoring sound.
 */
const stopCharacterSnoringSound = () => audioManager.stopCharacterSnoring();

/**
 * Plays background music.
 */
const playBackgroundMusic = () => audioManager.playBackgroundMusic();

/**
 * Stops background music.
 */
const stopBackgroundMusic = () => audioManager.stopBackgroundMusic();

/**
 * Plays endboss attack music.
 * @param {Object} world - Game world object.
 */
const playEndbossAttackMusic = (world) => audioManager.playEndbossAttackMusic(world);

/**
 * Stops endboss attack music.
 * @param {Object} world - Game world object.
 */
const stopEndbossAttackMusic = (world) => audioManager.stopEndbossAttackMusic(world);

/**
 * Plays new life sound.
 */
const playNewLifeSound = () => audioManager.playNewLifeSound();

/**
 * Plays enemy hurt sound based on enemy type.
 * @param {Object} enemy - Enemy object.
 */
const playEnemyHurtSound = (enemy) => audioManager.playEnemyHurtSound(enemy);

/**
 * Plays character hurt sound.
 */
const playCharacterHurtSound = () => audioManager.playCharacterHurtSound();

/**
 * Plays game over sound.
 */
const playGameOverSound = () => audioManager.playGameOverSound();

/**
 * Plays game won sound.
 */
const playGameWonSound = () => audioManager.playGameWonSound();

/**
 * Plays coin collect sound.
 */
const playCoinCollectSound = () => audioManager.playCoinCollectSound();

/**
 * Plays bottle collect sound.
 */
const playBottleCollectSound = () => audioManager.playBottleCollectSound();

/**
 * Stops all game end sounds.
 * @param {Object} world - Game world object.
 */
const stopAllGameEndSounds = (world) => audioManager.stopAllGameEndSounds(world);

/**
 * Toggles sound on or off.
 * @param {Object} world - Game world object.
 */
const toggleSound = (world) => audioManager.toggleSound(world);

/**
 * Enables all game sounds.
 * @param {Object} world - Game world object.
 */
const enableAllSounds = (world) => audioManager.enableAllSounds(world);

/**
 * Disables all game sounds.
 * @param {Object} world - Game world object.
 */
const disableAllSounds = (world) => audioManager.disableAllSounds(world);

/**
 * Mutes all game sounds.
 * @param {Object} world - Game world object.
 */
const muteAllSounds = (world) => audioManager.muteGameSounds(world);

/**
 * Plays endboss hurt sound.
 */
const playEndbossHurtSound = () => audioManager.playEndbossHurtSound();

/**
 * Plays endboss attack sound.
 */
const playEndbossAttackSound = () => audioManager.playEndbossAttackSound();
