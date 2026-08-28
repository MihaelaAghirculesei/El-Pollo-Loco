import { World } from "../models/world.class.js";

let canvas, world, keyboard = new Keyboard(), isMuted = false;

window.showFooterOnGameEnd = showFooterOnGameEnd;

/**
 * Creates a new World instance.
 */
function createWorld() {
  world = new World(canvas, keyboard);
  window.world = world;
}

/**
 * Synchronizes all audio states.
 */
function syncAudio() {
  isMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
  audioManager.updateAllButtons();
}

/**
 * Initializes the game.
 */
function init() {
  canvas = document.getElementById("canvas");
  createWorld();
  world.startEnemiesAnimation();
  syncAudio();
  if (!audioManager.isGameMuted) {
    setTimeout(() => audioManager.playBackgroundMusic(), 500);
  }
}

/**
 * Updates audio icon based on mute state.
 */
function updateAudioIcon(isMuted) {
  const audioIcon = document.getElementById("audio-icon");
  if (audioIcon) {
    audioIcon.src = `img_pollo_locco/img/10_buttons/sound-icon-${isMuted ? 'off' : 'on'}.png`;
  }
}

/**
 * Maps physical key codes (KeyboardEvent.code) to game controls.
 */
const KEY_MAP = {
  ArrowRight: 'RIGHT', ArrowLeft: 'LEFT', ArrowUp: 'UP', ArrowDown: 'DOWN',
  Space: 'SPACE', KeyD: 'D',
};

/**
 * Sets keyboard key state.
 */
function setKeyState(code, state) {
  const control = KEY_MAP[code];
  if (control) keyboard[control] = state;
}

/**
 * Sets up keyboard event listeners.
 */
function setupKeyListeners() {
  window.addEventListener("keydown", (e) => setKeyState(e.code, true));
  window.addEventListener("keyup", (e) => setKeyState(e.code, false));
}

/**
 * Hides start screen and shows game content.
 */
function hideStartScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.body.classList.remove('start-screen-active'); 
}

/**
 * Toggles mobile controls visibility.
 */
function toggleMobileControls(showMobile) {
  if (!isMobile()) return;
  document.querySelector("footer").style.display = showMobile ? "none" : "flex";
  document.getElementById("mobile-controls").style.display = showMobile ? "flex" : "none";
}

/**
 * Starts the game.
 */
window.startGame = function () {
  setFooterButtonsVisibility(true);
  hideStartScreen();
  init();
  toggleMobileControls(true);
};

/**
 * Cleans up world resources.
 */
function cleanupWorldResources() {
  world?.stopAllLoops();
}

/**
 * Shows the start screen.
 */
function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("content").style.display = "none";
  document.body.classList.add('start-screen-active');
}

/**
 * Returns to main menu.
 */
window.returnToMenu = function () {
  cleanupWorldResources();
  showStartScreen();
  toggleMobileControls(false);
  location.reload();
};

/**
 * Toggles screen display state.
 */
function toggleScreen(screenId, show) {
  const screen = document.getElementById(screenId);
  screen.style.display = show ? "flex" : "none";
  if (show) screen.style.backgroundColor = "white";
}

/**
 * Opens controls screen.
 */
window.openControls = () => toggleScreen("controlsScreen", true);

/**
 * Closes controls screen.
 */
window.closeControls = () => toggleScreen("controlsScreen", false);

/**
 * Opens story screen.
 */
window.openStory = () => toggleScreen("storyScreen", true);

/**
 * Closes story screen.
 */
window.closeStory = () => toggleScreen("storyScreen", false);

/**
 * Goes to home page.
 */
window.goToHome = function () {
  cleanupWorldResources();
  location.reload();
};

/**
 * Shows footer on game end for mobile.
 */
function showFooterOnGameEnd() {
  if (isMobile()) {
    toggleMobileControls(false);
    const playAgainBtn = document.getElementById("btn-play-again");
    if (playAgainBtn) playAgainBtn.style.display = "block";
  }
}

/**
 * Sets footer buttons visibility.
 */
function setFooterButtonsVisibility(isVisible) {
  const display = isVisible ? 'inline-block' : 'none';
  const homeButton = document.getElementById('home-button');
  if (homeButton) homeButton.style.display = display;
}

/**
 * Initializes audio sync with delay.
 */
function initializeAudioSync() {
  setTimeout(() => {
    isMuted = audioManager.isGameMuted;
    updateAudioIcon(isMuted);
    syncAudio();
  }, 100);
}

/**
 * Handles DOM content loaded.
 */
function handleDOMContentLoaded() {
  setFooterButtonsVisibility(false);
  document.body.classList.add('start-screen-active');
  initializeAudioSync();
}

/**
 * Detects mobile device.
 */
function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Toggles global audio.
 */
function toggleGlobalAudio() {
  audioManager.toggleSound(null);
  isMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
}
window.toggleGlobalAudio = toggleGlobalAudio;

/**
 * Adds touch event listeners to element.
 */
function addTouchEventListeners(element, keyProperty) {
  element.addEventListener("touchstart", () => keyboard[keyProperty] = true, { passive: true });
  element.addEventListener("touchend", () => keyboard[keyProperty] = false, { passive: true });
}

/**
 * Sets up touch control for element.
 */
function setupTouchControl(elementId, keyProperty, callback = null) {
  const element = document.getElementById(elementId);
  if (!element) return;
  callback ? element.addEventListener("touchstart", callback, { passive: false }) 
           : addTouchEventListeners(element, keyProperty);
}

/**
 * Sets up all touch controls for game interface.
 */
function setupAllTouchControls() {
  setupIndividualTouchControls();
  setupDirectionalButtonsContextMenu();
}

/**
 * Configures individual touch control mappings.
 */
function setupIndividualTouchControls() {
  const controls = [
    ["btn-home", null, () => window.goToHome()],
    ["btn-left", "LEFT"], ["btn-right", "RIGHT"], 
    ["btn-jump", "SPACE"], ["btn-throw", "D"],
    ["btn-audio", null, (e) => { e.preventDefault(); toggleGlobalAudio(); }],
    ["btn-play-again", null, () => window.playAgain()]
  ];
  
  controls.forEach(([id, key, callback]) => {
    setupTouchControl(id, key, callback);
  });
}

/**
 * Disables context menu on directional buttons.
 */
function setupDirectionalButtonsContextMenu() {
  ["btn-left", "btn-right"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("contextmenu", (e) => e.preventDefault());
    }
  });
}

/**
 * Shows mobile controls.
 */
function showMobileControls() {
  if (!isMobile()) return;
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) mobileControls.style.display = "flex";
  setupAllTouchControls();
}

/**
 * Initializes mobile and orientation.
 */
function initializeMobileAndOrientation() {
  showMobileControls();
  checkOrientation();
}

/**
 * Checks device orientation.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (overlay) overlay.style.display = window.innerHeight > window.innerWidth ? "flex" : "none";
}

let resizeTimeout;

/**
 * Throttled orientation check.
 */
function throttledCheckOrientation() {
  if (resizeTimeout) return;
  resizeTimeout = requestAnimationFrame(() => {
    checkOrientation();
    resizeTimeout = null;
  });
}

/**
 * Sets up orientation listeners.
 */
function setupOrientationListeners() {
  window.addEventListener("resize", throttledCheckOrientation, { passive: true });
  window.addEventListener("orientationchange", checkOrientation, { passive: true });
  document.addEventListener("DOMContentLoaded", checkOrientation, { passive: true });
}

/**
 * Restarts the game in place: tears the finished world down, clears the
 * end screens, and builds a fresh one. No page reload, so the decoded
 * image pool carries over to the next run.
 */
window.playAgain = function () {
  if (world) {
    world.stopAllLoops();
    audioManager.stopAllGameEndSounds(world);
  }
  clearEndScreens();
  init();
  toggleMobileControls(true);
};

/**
 * Removes the game-over / win overlays and the new-life popup, and undoes
 * the canvas hiding done when the game ended.
 */
function clearEndScreens() {
  document.querySelectorAll('.game-over-screen, .game-won-screen, .popup')
    .forEach(el => el.remove());
  document.getElementById('canvas').style.display = '';
  document.getElementById('titleCanvas').style.display = '';
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, { passive: true });
document.addEventListener("DOMContentLoaded", initializeMobileAndOrientation, { passive: true });

setupKeyListeners();
setupOrientationListeners();