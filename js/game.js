import { World } from "../models/world.class.js";

let canvas, world, keyboard = new Keyboard(), isMuted = false;

window.showFooterOnGameEnd = showFooterOnGameEnd;

/** Initializes the canvas element */
function initCanvas() {
  canvas = document.getElementById("canvas");
}

/** Creates a new World instance */
function createWorld() {
  world = new World(canvas, keyboard);
  window.world = world;
}

/** Synchronizes all audio states */
function syncAudio() {
  isMuted = audioManager.isGameMuted;
  isGameMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
  audioManager.updateAllButtons();
}

/** Initializes the game */
function init() {
  initCanvas();
  createWorld();
  world.startEnemiesAnimation();
  syncAudio();
}

/** Updates the audio icon based on mute state */
function updateAudioIcon(isMuted) {
  const audioIcon = document.getElementById("audio-icon");
  if (audioIcon) {
    audioIcon.src = `img_pollo_locco/img/10_buttons/sound-icon-${isMuted ? 'off' : 'on'}.png`;
  }
}

/** Sets keyboard key state */
function setKeyState(keyCode, state) {
  const keys = {39: 'RIGHT', 37: 'LEFT', 38: 'UP', 40: 'DOWN', 32: 'SPACE', 68: 'D'};
  if (keys[keyCode]) keyboard[keys[keyCode]] = state;
}

/** Sets up keyboard event listeners */
function setupKeyListeners() {
  window.addEventListener("keydown", (e) => setKeyState(e.keyCode, true));
  window.addEventListener("keyup", (e) => setKeyState(e.keyCode, false));
}

/** Hides start screen and shows game content */
function hideStartScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.body.classList.remove('start-screen-active');
}

/** Toggles mobile controls visibility */
function toggleMobileControls(showMobile) {
  if (!isMobile()) return;
  document.querySelector("footer").style.display = showMobile ? "none" : "flex";
  document.getElementById("mobile-controls").style.display = showMobile ? "flex" : "none";
}

/** Shows mobile controls if needed */
function showMobileControlsIfNeeded() {
  toggleMobileControls(true);
}

/** Starts the game */
window.startGame = function () {
  setFooterButtonsVisibility(true);
  hideStartScreen();
  init();
  showMobileControlsIfNeeded();
};

/** Cleans up world resources */
function cleanupWorldResources() {
  if (world?.gameInterval) clearInterval(world.gameInterval);
}

/** Shows the start screen */
function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("content").style.display = "none";
  document.body.classList.add('start-screen-active');
}

/** Returns to main menu */
window.returnToMenu = function () {
  cleanupWorldResources();
  showStartScreen();
  toggleMobileControls(false);
  location.reload();
};

/** Toggles screen display state */
function toggleScreen(screenId, show) {
  const screen = document.getElementById(screenId);
  screen.style.display = show ? "flex" : "none";
  if (show) screen.style.backgroundColor = "white";
}

window.openControls = () => toggleScreen("controlsScreen", true);
window.closeControls = () => toggleScreen("controlsScreen", false);
window.openStory = () => toggleScreen("storyScreen", true);
window.closeStory = () => toggleScreen("storyScreen", false);

/** Goes to home page */
window.goToHome = function () {
  cleanupWorldResources();
  location.reload();
};

/** Shows footer on game end for mobile */
function showFooterOnGameEnd() {
  if (isMobile()) {
    toggleMobileControls(false);
    const playAgainBtn = document.getElementById("btn-play-again");
    if (playAgainBtn) playAgainBtn.style.display = "block";
  }
}

/** Sets footer buttons visibility */
function setFooterButtonsVisibility(isVisible) {
  const display = isVisible ? 'inline-block' : 'none';
  const homeButton = document.getElementById('home-button');
  if (homeButton) homeButton.style.display = display;
}

/** Loads global sound state */
function loadGlobalSoundState() {
  isMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
}

/** Initializes audio sync with delay */
function initializeAudioSync() {
  setTimeout(() => {
    loadGlobalSoundState();
    syncAudio();
  }, 100);
}

/** Handles DOM content loaded */
function handleDOMContentLoaded() {
  setFooterButtonsVisibility(false);
  initializeAudioSync();
}

/** Detects mobile device */
function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/** Toggles global audio */
function toggleGlobalAudio() {
  audioManager.toggleSound(null);
  isMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
}
window.toggleGlobalAudio = toggleGlobalAudio;

/** Adds touch event listeners */
function addTouchEventListeners(element, keyProperty) {
  element.addEventListener("touchstart", () => keyboard[keyProperty] = true, { passive: true });
  element.addEventListener("touchend", () => keyboard[keyProperty] = false, { passive: true });
}

/** Sets up touch control for element */
function setupTouchControl(elementId, keyProperty, callback = null) {
  const element = document.getElementById(elementId);
  if (!element) return;
  callback ? element.addEventListener("touchstart", callback, { passive: false }) 
           : addTouchEventListeners(element, keyProperty);
}

/** Sets up all touch controls */
function setupAllTouchControls() {
  const controls = [
    ["btn-home", null, () => window.goToHome()],
    ["btn-left", "LEFT"], ["btn-right", "RIGHT"], ["btn-jump", "SPACE"], ["btn-throw", "D"],
    ["btn-audio", null, (e) => { e.preventDefault(); toggleGlobalAudio(); }],
    ["btn-play-again", null, () => window.playAgain()]
  ];
  controls.forEach(([id, key, callback]) => setupTouchControl(id, key, callback));
}

/** Shows mobile controls */
function showMobileControls() {
  if (!isMobile()) return;
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) mobileControls.style.display = "flex";
  setupAllTouchControls();
}

/** Initializes mobile and orientation */
function initializeMobileAndOrientation() {
  showMobileControls();
  checkOrientation();
}

/** Checks device orientation */
function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (overlay) overlay.style.display = window.innerHeight > window.innerWidth ? "flex" : "none";
}

let resizeTimeout;
/** Throttled orientation check */
function throttledCheckOrientation() {
  if (resizeTimeout) return;
  resizeTimeout = requestAnimationFrame(() => {
    checkOrientation();
    resizeTimeout = null;
  });
}

/** Sets up orientation listeners */
function setupOrientationListeners() {
  window.addEventListener("resize", throttledCheckOrientation, { passive: true });
  window.addEventListener("orientationchange", checkOrientation, { passive: true });
  document.addEventListener("DOMContentLoaded", checkOrientation, { passive: true });
}

/** Toggles menu overlay */
function toggleMenuOverlay(show) {
  const menuOverlay = document.getElementById('menu-overlay');
  if (menuOverlay) menuOverlay.classList.toggle('d_none', !show);
}

/** Pauses the game */
window.pauseGame = function() {
  toggleMenuOverlay(true);
  updateMenuSoundButton();
};

/** Updates menu sound button text */
function updateMenuSoundButton() {
  const btnSound = document.getElementById('btnSound');
  if (btnSound) btnSound.innerText = audioManager.isGameMuted ? 'Turn On Sounds' : 'Turn Off Sounds';
}

/** Toggles game sounds */
window.toggleSounds = function() {
  toggleSound(world);
  updateMenuSoundButton();
};

/** Resumes the game */
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
*/
document.addEventListener('DOMContentLoaded', function() {
 if (localStorage.getItem('autoStartGame') === 'true') {
   localStorage.removeItem('autoStartGame');
   setTimeout(() => startGame(), 100);
 }
});

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, { passive: true });
document.addEventListener("DOMContentLoaded", initializeMobileAndOrientation, { passive: true });

setupKeyListeners();
setupOrientationListeners();