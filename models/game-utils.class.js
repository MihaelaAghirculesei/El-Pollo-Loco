// ==================== CONSTANTS ====================

const SELECTORS = {
  GAME_OVER_SCREEN: '.game-over-screen',
  CANVAS: '#canvas',
  TITLE_CANVAS: '#titleCanvas',
  FOOTER: 'footer',
  GAME_WON_SCREEN: '#game-won-screen'
};

const GAME_OVER_IMAGE_PATH = 'img_pollo_locco/img/9_intro_outro_screens/game_over/oh no you lost!.png';

// ==================== GAME END FUNCTIONS ====================

/**
 * Sets the game state to "game over" and stops the game loop
 * @param {Object} world - The game world object containing state and intervals
 */
function setGameOverState(world) {
  world.gameOver = true;
  clearInterval(world.gameInterval);
}

/**
 * Hides the main game canvas and the title canvas
 */
function hideCanvases() {
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('titleCanvas').style.display = 'none';
}

/**
 * Removes all existing game over screen elements from the DOM
 */
function removeExistingScreens() {
  document.querySelectorAll(SELECTORS.GAME_OVER_SCREEN).forEach(screen => screen.remove());
}

/**
 * Displays the footer element by setting its display style to 'flex'
 */
function showFooter() {
  const footer = document.querySelector(SELECTORS.FOOTER);
  if (footer) footer.style.display = 'flex';
}

/**
 * Creates and appends a game over screen element with an image
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
 * Creates and shows the game won screen if it doesn't exist
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
 * Handles the flow when the game is over; prevents multiple triggers
 * @param {Object} world - The game world object
 * @returns {boolean} - Returns false if the game is already over, true otherwise
 */
function handleGameOverFlow(world) {
  if (world?.gameOver) return false;
  setGameOverState(world);
  return true;
}

/**
 * Handles the flow when the game is won; manages state and UI
 * @param {Object} world - The game world object
 */
function handleGameWonFlow(world) {
  window.showFooterOnGameEnd();
  clearInterval(world.gameInterval);
  stopAllGameEndSounds(world);
  createGameWonScreen();
}

/**
 * Finds the endboss enemy within the current game level
 * @param {Object} world - The game world object
 * @returns {Object|undefined} - Returns the endboss enemy object if found, otherwise undefined
 */
function findEndboss(world) {
  return world?.level?.enemies?.find(enemy => enemy instanceof Endboss);
}

/**
 * Initiates the game over display sequence
 * @param {Object} world - The game world object
 */
function showGameOver(world) {
  if (!world) return;
  removeExistingScreens();
  if (!handleGameOverFlow(world)) return;
  stopAllGameEndSounds(world);
  hideCanvases();
  createGameOverScreen();
  showFooter();
  playGameOverSound();
}

/**
 * Initiates the game won display sequence
 * @param {Object} world - The game world object
 */
function showGameWon(world) {
  if (!world) return;
  removeExistingScreens();
  handleGameWonFlow(world);
}

/**
 * Checks if the game has ended and triggers the appropriate end screen
 * @param {Object} world - The game world object
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

// ==================== AUDIO FUNCTIONS ====================
const playSound = (path, volume) => audioManager.playSound(path, volume);
const playCharacterSnoringSound = () => audioManager.playCharacterSnoring();
const stopCharacterSnoringSound = () => audioManager.stopCharacterSnoring();
const playBackgroundMusic = () => audioManager.playBackgroundMusic();
const stopBackgroundMusic = () => audioManager.stopBackgroundMusic();
const playEndbossAttackMusic = (world) => audioManager.playEndbossAttackMusic(world);
const stopEndbossAttackMusic = (world) => audioManager.stopEndbossAttackMusic(world);
const playNewLifeSound = () => audioManager.playNewLifeSound();
const playEnemyHurtSound = (enemy) => audioManager.playEnemyHurtSound(enemy);
const playCharacterHurtSound = () => audioManager.playCharacterHurtSound();
const playGameOverSound = () => audioManager.playGameOverSound();
const playGameWonSound = () => audioManager.playGameWonSound();
const playCoinCollectSound = () => audioManager.playCoinCollectSound();
const playBottleCollectSound = () => audioManager.playBottleCollectSound();
const stopAllGameEndSounds = (world) => audioManager.stopAllGameEndSounds(world);
const toggleSound = (world) => audioManager.toggleSound(world);
const enableAllSounds = (world) => audioManager.enableAllSounds(world);
const disableAllSounds = (world) => audioManager.disableAllSounds(world);
const muteAllSounds = (world) => audioManager.muteGameSounds(world);
const playEndbossHurtSound = () => audioManager.playEndbossHurtSound();
const playEndbossAttackSound = () => audioManager.playEndbossAttackSound();

// ==================== COLLISION DETECTION ====================

/**
 * Checks collision between character and enemy using reduced collision zones
 * @param {Object} character - The character object
 * @param {Object} enemy - The enemy to check collision with
 * @returns {boolean} True if collision detected
 */
function isCollidingWithEnemy(character, enemy) {
  const charMargin = 20, enemyMargin = 15;
  const charLeft = character.x + charMargin;
  const charRight = character.x + character.width - charMargin;
  const charTop = character.y + charMargin;
  const charBottom = character.y + character.height - charMargin;
  const enemyLeft = enemy.x + enemyMargin;
  const enemyRight = enemy.x + enemy.width - enemyMargin;
  const enemyTop = enemy.y + enemyMargin;
  const enemyBottom = enemy.y + enemy.height - enemyMargin;
  
  return charRight > enemyLeft && charLeft < enemyRight && 
         charBottom > enemyTop && charTop < enemyBottom;
}

/**
 * Check if character is colliding with a collectible item
 * @param {Object} character - The character object
 * @param {Object} item - The collectible item to check collision with
 * @returns {boolean} True if collision detected, false otherwise
 */
function isCollidingWithItem(character, item) {
  const charMargin = 30;
  const isCoin = item.constructor.name === 'Coin' || item.height > 100;
  const itemMargin = isCoin ? 40 : 10;
  
  const charLeft = character.x + charMargin;
  const charRight = character.x + character.width - charMargin;
  const charTop = character.y + charMargin;
  const charBottom = character.y + character.height - charMargin;
  const itemLeft = item.x + itemMargin;
  const itemRight = item.x + item.width - itemMargin;
  const itemTop = item.y + itemMargin;
  const itemBottom = item.y + item.height - itemMargin;
  
  return charRight > itemLeft && charLeft < itemRight && 
         charBottom > itemTop && charTop < itemBottom;
}

// ==================== VALIDATION UTILITIES ====================

/**
 * Determines if character is performing a valid jump attack on enemy
 * @param {Object} character - The character object
 * @param {Object} enemy - The enemy to check against
 * @returns {boolean} True if valid jump attack
 */
function isValidJump(character, enemy) {
  return character.isAboveGround() && character.y < (enemy.y - 20);
}

/**
 * Calculates cooldown time based on enemy type
 * @param {Object} enemy - The enemy object
 * @returns {number} Cooldown time in milliseconds
 */
function calculateCooldownTime(enemy) {
  return enemy instanceof Endboss ? 3000 : 15000;
}

/**
 * Handles collision damage with per-enemy cooldown tracking
 * @param {Object} character - The character object
 * @param {Object} enemy - The enemy that caused the collision
 * @returns {boolean} True if damage was applied, false if still in cooldown
 */
function shouldApplyCollisionDamage(character, enemy) {
  const now = Date.now();
  const lastHitTime = character.hitByEnemies.get(enemy) || 0;
  const cooldownTime = calculateCooldownTime(enemy);
  
  if (now - lastHitTime > cooldownTime) {
    character.hitByEnemies.set(enemy, now);
    return true;
  }
  return false;
}

// ==================== COLLECTION UTILITIES ====================

/**
 * Check collision with collectible items and handle collection
 * @param {Object} character - The character object
 * @param {Array} items - Array of collectible items
 * @param {Function} collectFn - Function to call when item is collected
 * @param {Function} soundFn - Function to play sound on collection
 * @returns {Array} Updated array with collected items removed
 */
function checkCollectible(character, items, collectFn, soundFn) {
  const itemsToRemove = [];
  items.forEach((item, index) => {
    if (isCollidingWithItem(character, item) && !item.isCollected) {
      soundFn();
      collectFn();
      item.isCollected = true;
      itemsToRemove.push(index);
    }
  });
  itemsToRemove.reverse().forEach(index => items.splice(index, 1));
  return items;
}

/**
 * Filters objects marked for removal from an array
 * @param {Array} objectArray - Array of game objects
 * @returns {Array} Filtered array without marked objects
 */
function filterMarkedObjects(objectArray) {
  return objectArray.filter(obj => !obj.markedForRemoval);
}

// ==================== UI/POPUP UTILITIES ====================

/**
 * Shows congratulations popup when player earns a new life
 * @param {HTMLCanvasElement} canvas - The game canvas
 */
function showCongratulations(canvas) {
  const div = document.createElement("div");
  div.className = "popup";
  div.innerHTML = `
    <p>Congratulations! You've collected 30 Coins and earned a new life!</p>
    <button class="button-popup" onclick="this.parentElement.remove()">Close</button>
  `;
  const { right, top } = canvas.getBoundingClientRect();
  Object.assign(div.style, {
    left: `${right + 17}px`,
    top: `${top - 7}px`
  });
  document.body.appendChild(div);
  playNewLifeSound();
  setTimeout(() => div.remove(), 2000);
}

// ==================== RENDERING UTILITIES ====================

/**
 * Clears the entire canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Flips an image horizontally for rendering in opposite direction
 */
function flipImage(ctx, mo) {
  ctx.save();
  ctx.translate(mo.width, 0);
  ctx.scale(-1, 1);
  mo.x *= -1;
}

/**
 * Restores image to original orientation after flipping
 */
function flipImageBack(ctx, mo) {
  mo.x *= -1;
  ctx.restore();
}