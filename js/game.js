import { World } from "../models/world.class.js";

let canvas, world, keyboard = new Keyboard(), isMuted = false;

window.showFooterOnGameEnd = showFooterOnGameEnd;

function initCanvas() {
  canvas = document.getElementById("canvas");
}

function createWorld() {
  world = new World(canvas, keyboard);
  window.world = world;
}

function syncAudio() {
  isMuted = audioManager.isGameMuted;
  isGameMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
  audioManager.updateAllButtons();
}

function init() {
  initCanvas();
  createWorld();
  world.startEnemiesAnimation();
  syncAudio();
}

function updateAudioIcon(isMuted) {
  const audioIcon = document.getElementById("audio-icon");
  if (audioIcon) {
    audioIcon.src = `img_pollo_locco/img/10_buttons/sound-icon-${isMuted ? 'off' : 'on'}.png`;
  }
}

function setKeyState(keyCode, state) {
  const keys = {39: 'RIGHT', 37: 'LEFT', 38: 'UP', 40: 'DOWN', 32: 'SPACE', 68: 'D'};
  if (keys[keyCode]) keyboard[keys[keyCode]] = state;
}

function setupKeyListeners() {
  window.addEventListener("keydown", (e) => setKeyState(e.keyCode, true));
  window.addEventListener("keyup", (e) => setKeyState(e.keyCode, false));
}

function hideStartScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.body.classList.remove('start-screen-active');
}

function toggleMobileControls(showMobile) {
  if (!isMobile()) return;
  
  document.querySelector("footer").style.display = showMobile ? "none" : "flex";
  document.getElementById("mobile-controls").style.display = showMobile ? "flex" : "none";
}

function showMobileControlsIfNeeded() {
  toggleMobileControls(true);
}

window.startGame = function () {
  setFooterButtonsVisibility(true);
  hideStartScreen();
  init();
  showMobileControlsIfNeeded();
};

function cleanupWorldResources() {
  if (world?.gameInterval) clearInterval(world.gameInterval);
}

function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("content").style.display = "none";
  document.body.classList.add('start-screen-active');
}

function resetMobileControlsForMenu() {
  toggleMobileControls(false);
}

window.returnToMenu = function () {
  cleanupWorldResources();
  showStartScreen();
  resetMobileControlsForMenu();
  location.reload();
};

function toggleScreen(screenId, show) {
  const screen = document.getElementById(screenId);
  screen.style.display = show ? "flex" : "none";
  if (show) screen.style.backgroundColor = "white";
}

window.openControls = () => toggleScreen("controlsScreen", true);
window.closeControls = () => toggleScreen("controlsScreen", false);
window.openStory = () => toggleScreen("storyScreen", true);
window.closeStory = () => toggleScreen("storyScreen", false);

window.goToHome = function () {
  cleanupWorldResources();
  location.reload();
};

function showFooterOnGameEnd() {
  if (isMobile()) {
    toggleMobileControls(false);
    const playAgainBtn = document.getElementById("btn-play-again");
    if (playAgainBtn) playAgainBtn.style.display = "block";
  }
}

function setFooterButtonsVisibility(isVisible) {
  const display = isVisible ? 'inline-block' : 'none';
  const homeButton = document.getElementById('home-button');
  if (homeButton) homeButton.style.display = display;
}

function loadGlobalSoundState() {
  isMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
}

function initializeAudioSync() {
  setTimeout(() => {
    loadGlobalSoundState();
    syncAudio();
  }, 100);
}

function handleDOMContentLoaded() {
  setFooterButtonsVisibility(false);
  initializeAudioSync();
}

function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function toggleGlobalAudio() {
  audioManager.toggleSound(null);
  isMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
}
window.toggleGlobalAudio = toggleGlobalAudio;

function addTouchEventListeners(element, keyProperty) {
  element.addEventListener("touchstart", () => keyboard[keyProperty] = true, { passive: true });
  element.addEventListener("touchend", () => keyboard[keyProperty] = false, { passive: true });
}

function setupTouchControl(elementId, keyProperty, callback = null) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  callback ? element.addEventListener("touchstart", callback, { passive: false }) 
           : addTouchEventListeners(element, keyProperty);
}

function setupAllTouchControls() {
  const controls = [
    ["btn-home", null, () => window.goToHome()],
    ["btn-left", "LEFT"],
    ["btn-right", "RIGHT"],
    ["btn-jump", "SPACE"],
    ["btn-throw", "D"],
    ["btn-audio", null, (e) => { e.preventDefault(); toggleGlobalAudio(); }],
    ["btn-play-again", null, () => window.playAgain()]
  ];
  
  controls.forEach(([id, key, callback]) => setupTouchControl(id, key, callback));
}

function showMobileControls() {
  if (!isMobile()) return;
  
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) mobileControls.style.display = "flex";
  setupAllTouchControls();
}

function initializeMobileAndOrientation() {
  showMobileControls();
  checkOrientation();
}

function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (overlay) overlay.style.display = window.innerHeight > window.innerWidth ? "flex" : "none";
}

let resizeTimeout;
function throttledCheckOrientation() {
  if (resizeTimeout) return;
  resizeTimeout = requestAnimationFrame(() => {
    checkOrientation();
    resizeTimeout = null;
  });
}

function setupOrientationListeners() {
  window.addEventListener("resize", throttledCheckOrientation, { passive: true });
  window.addEventListener("orientationchange", checkOrientation, { passive: true });
  document.addEventListener("DOMContentLoaded", checkOrientation, { passive: true });
}

function toggleMenuOverlay(show) {
  const menuOverlay = document.getElementById('menu-overlay');
  if (menuOverlay) menuOverlay.classList.toggle('d_none', !show);
}

window.pauseGame = function() {
  toggleMenuOverlay(true);
  updateMenuSoundButton();
};

function updateMenuSoundButton() {
  const btnSound = document.getElementById('btnSound');
  if (btnSound) btnSound.innerText = audioManager.isGameMuted ? 'Turn On Sounds' : 'Turn Off Sounds';
}

window.toggleSounds = function() {
  toggleSound(world);
  updateMenuSoundButton();
};

window.resumeGame = function() {
  toggleMenuOverlay(false);
};
/**
* Restarts the game by setting a flag in localStorage and reloading the page.
* This function creates a seamless restart experience by preserving the intent
* to restart across page reloads.
* 
* @function playAgain
* @global
* @returns {void}
* @example
* // Call this function when user clicks "Play Again" button
* window.playAgain();
*/
window.playAgain = function() {
 // Save a state flag indicating that we need to restart the game
 localStorage.setItem('autoStartGame', 'true');
 location.reload();
};

/**
* Event listener that runs when the DOM is fully loaded.
* Checks if the game should auto-start based on a localStorage flag.
* This works in conjunction with playAgain() to create a smooth restart flow.
* 
* @event DOMContentLoaded
* @listens document#DOMContentLoaded
* @returns {void}
* @example
* // This runs automatically when the page loads
* // No manual invocation needed
*/
document.addEventListener('DOMContentLoaded', function() {
 /**
  * Check if auto-start flag exists in localStorage
  * @type {string|null}
  */
 if (localStorage.getItem('autoStartGame') === 'true') {
   // Clean up the flag to prevent unwanted restarts
   localStorage.removeItem('autoStartGame');
   
   /**
    * Start the game after a short delay to ensure DOM is ready
    * @timeout 100ms
    */
   setTimeout(() => startGame(), 100);
 }
});
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, { passive: true });
document.addEventListener("DOMContentLoaded", initializeMobileAndOrientation, { passive: true });

setupKeyListeners();
setupOrientationListeners();