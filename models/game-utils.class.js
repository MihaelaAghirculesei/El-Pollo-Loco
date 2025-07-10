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
 * Sets game state to over and stops game loop.
 * @param {Object} world - Game world object
 */
function setGameOverState(world) {
  world.gameOver = true;
  clearInterval(world.gameInterval);
}

/**
 * Hides main game canvases.
 */
function hideCanvases() {
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('titleCanvas').style.display = 'none';
}

/**
 * Removes existing game over screens.
 */
function removeExistingScreens() {
  document.querySelectorAll(SELECTORS.GAME_OVER_SCREEN).forEach(screen => screen.remove());
}

/**
 * Shows footer element.
 */
function showFooter() {
  const footer = document.querySelector(SELECTORS.FOOTER);
  if (footer) footer.style.display = 'flex';
}

/**
 * Creates and displays game over screen.
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
 * Creates and shows game won screen.
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
 * Handles game over flow logic.
 * @param {Object} world - Game world object
 * @returns {boolean} True if game over handled
 */
function handleGameOverFlow(world) {
  if (world?.gameOver) return false;
  setGameOverState(world);
  return true;
}

/**
 * Handles game won flow logic.
 * @param {Object} world - Game world object
 */
function handleGameWonFlow(world) {
  window.showFooterOnGameEnd();
  clearInterval(world.gameInterval);
  stopAllGameEndSounds(world);
  createGameWonScreen();
}

/**
 * Finds endboss in current level.
 * @param {Object} world - Game world object
 * @returns {Object|undefined} Endboss enemy or undefined
 */
function findEndboss(world) {
  return world?.level?.enemies?.find(enemy => enemy instanceof Endboss);
}

/**
 * Shows game over screen sequence.
 * @param {Object} world - Game world object
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
 * Shows game won screen sequence.
 * @param {Object} world - Game world object
 */
function showGameWon(world) {
  if (!world) return;
  removeExistingScreens();
  handleGameWonFlow(world);
}

/**
 * Checks if game has ended and triggers appropriate screen.
 * @param {Object} world - Game world object
 */
function checkGameEnd(world) {
  if (!world) return;
  const endboss = findEndboss(world);
  if (world.character?.isDead()) {
    showGameOver(world);
  } else if (endboss?.health <= 0 && !world.gameEndTriggered) {
    world.gameEndTriggered = true;
    setTimeout(() => {
      showGameWon(world);
    }, 2500);
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

/**
 * Checks collision between character and enemy.
 * @param {Object} character - Character object
 * @param {Object} enemy - Enemy object
 * @returns {boolean} True if colliding
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
 * Checks collision between character and collectible item.
 * @param {Object} character - Character object
 * @param {Object} item - Collectible item
 * @returns {boolean} True if colliding
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

/**
 * Checks if character recently changed direction.
 * @param {Object} character - Character object
 * @returns {boolean} True if direction changed recently
 */
function hasRecentDirectionChange(character) {
  return character.lastDirectionChangeTime && Date.now() - character.lastDirectionChangeTime < 300;
}

/**
 * Determines if character is performing valid jump attack.
 * @param {Object} character - Character object
 * @param {Object} enemy - Enemy object
 * @returns {boolean} True if valid jump attack
 */
function isValidJump(character, enemy) {
  const isInAir = character.isAboveGround();
  const isAboveEnemy = character.y < (enemy.y - 20);
  const isFalling = character.speedY < 5;
  
  return hasRecentDirectionChange(character) 
    ? isInAir && isAboveEnemy 
    : isInAir && isAboveEnemy && isFalling;
}

/**
 * Calculates cooldown time based on enemy type.
 * @param {Object} enemy - Enemy object
 * @returns {number} Cooldown time in milliseconds
 */
function calculateCooldownTime(enemy) {
  return enemy instanceof Endboss ? 3000 : 1500;
}

/**
 * Handles enemy-specific cooldown logic.
 * @param {Object} character - Character object
 * @param {Object} enemy - Enemy object
 * @param {number} cooldownTime - Cooldown duration
 * @returns {boolean} True if cooldown allows damage
 */
function handleEnemySpecificCooldown(character, enemy, cooldownTime) {
  const now = Date.now();
  const lastHitTime = character.hitByEnemies.get(enemy) || 0;
  
  if (now - lastHitTime > cooldownTime) {
    character.hitByEnemies.set(enemy, now);
    return true;
  }
  return false;
}

/**
 * Handles global cooldown for regular enemies.
 * @param {Object} character - Character object
 * @param {number} cooldownTime - Cooldown duration
 * @returns {boolean} True if cooldown allows damage
 */
function handleGlobalCooldown(character, cooldownTime) {
  const now = Date.now();
  if (!character.lastGlobalHitTime) character.lastGlobalHitTime = 0;
  
  if (now - character.lastGlobalHitTime > cooldownTime) {
    character.lastGlobalHitTime = now;
    return true;
  }
  return false;
}

/**
 * Determines if collision damage should be applied.
 * @param {Object} character - Character object
 * @param {Object} enemy - Enemy object
 * @returns {boolean} True if damage should be applied
 */
function shouldApplyCollisionDamage(character, enemy) {
  if (character.lastJumpKillTime && Date.now() - character.lastJumpKillTime < 300) {
    return false;
  }
  
  const cooldownTime = calculateCooldownTime(enemy);
  
  if (enemy instanceof Endboss) {
    return handleEnemySpecificCooldown(character, enemy, cooldownTime);
  } else {
    return handleGlobalCooldown(character, cooldownTime);
  }
}

/**
 * Checks collision with collectibles and handles collection.
 * @param {Object} character - Character object
 * @param {Array} items - Array of collectible items
 * @param {Function} collectFn - Collection callback function
 * @param {Function} soundFn - Sound callback function
 * @returns {Array} Updated items array
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
 * Filters objects marked for removal.
 * @param {Array} objectArray - Array of game objects
 * @returns {Array} Filtered array
 */
function filterMarkedObjects(objectArray) {
  return objectArray.filter(obj => !obj.markedForRemoval);
}

/**
 * Shows congratulations popup for new life.
 * @param {HTMLCanvasElement} canvas - Game canvas
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

/**
 * Clears the entire canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Flips image horizontally for rendering.
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} mo - Movable object
 */
function flipImage(ctx, mo) {
  ctx.save();
  ctx.translate(mo.width, 0);
  ctx.scale(-1, 1);
  mo.x *= -1;
}

/**
 * Restores image to original orientation.
 */
function flipImageBack(ctx, mo) {
  mo.x *= -1;
  ctx.restore();
}