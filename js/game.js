import { World } from "../models/world.class.js";

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
window.hideFooterButtonsAtEnd = hideFooterButtonsAtEnd;
window.showFooterOnGameEnd = showFooterOnGameEnd;

/** 
 * Initializes the game, creates the world, and starts animations 
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  window.world = world;
  world.startEnemiesAnimation();
  toggleSound(world);
}

/** 
 * Sets up event listeners for keydown events 
 */
function setupKeydownListeners() {
  window.addEventListener("keydown", (e) => {
    setKeyState(e.keyCode, true);
  });
}

/** 
 * Sets up event listeners for keyup events 
 */
function setupKeyupListeners() {
  window.addEventListener("keyup", (e) => {
    setKeyState(e.keyCode, false);
  });
}

/**
 * Updates the key state based on the pressed keyCode
 * @param {number} keyCode 
 * @param {boolean} state 
 */
function setKeyState(keyCode, state) {
  if (keyCode == 39) keyboard.RIGHT = state;
  if (keyCode == 37) keyboard.LEFT = state;
  if (keyCode == 38) keyboard.UP = state;
  if (keyCode == 40) keyboard.DOWN = state;
  if (keyCode == 32) keyboard.SPACE = state;
  if (keyCode == 68) keyboard.D = state;
}

/** 
 * Hides the start screen and shows the game canvas 
 */
function hideStartScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.body.classList.remove('start-screen-active');
}

/** 
 * Shows mobile controls if the device is mobile 
 */
function showMobileControlsIfNeeded() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "none";
    document.getElementById("mobile-controls").style.display = "flex";
  }
}

/** 
 * Starts the game 
 */
window.startGame = function () {
  showGameButtons();
  hideStartScreen();
  init();
  showMobileControlsIfNeeded();
};

/** 
 * Cleans up the world resources and intervals 
 */
function cleanupWorldResources() {
  if (world && world.gameInterval) {
    clearInterval(world.gameInterval);
  }
}

/** 
 * Shows the start screen 
 */
function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("content").style.display = "none";
  document.body.classList.add('start-screen-active');
}

/** 
 * Resets mobile controls visibility for the menu 
 */
function resetMobileControlsForMenu() {
  if (isMobile()) {
    document.getElementById("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
}

/** 
 * Returns to the menu and reloads the page 
 */
window.returnToMenu = function () {
  cleanupWorldResources();
  showStartScreen();
  resetMobileControlsForMenu();
  location.reload();
};

/**
 * Shows a specific screen by ID
 * @param {string} screenId 
 */
function showScreen(screenId) {
  document.getElementById(screenId).style.display = "flex";
  document.getElementById(screenId).style.backgroundColor = "white";
}

/**
 * Hides a specific screen by ID
 * @param {string} screenId 
 */
function hideScreen(screenId) {
  document.getElementById(screenId).style.display = "none";
}

/** 
 * Opens the controls screen 
 */
window.openControls = function () {
  showScreen("controlsScreen");
};

/** 
 * Closes the controls screen 
 */
window.closeControls = function () {
  hideScreen("controlsScreen");
};

/** 
 * Opens the story screen 
 */
window.openStory = function () {
  showScreen("storyScreen");
};

/** 
 * Closes the story screen 
 */
window.closeStory = function () {
  hideScreen("storyScreen");
};

/** 
 * Opens the settings screen 
 */
window.openSettings = function () {
  showScreen("settingsScreen");
};

/** 
 * Closes the settings screen 
 */
window.closeSettings = function () {
  hideScreen("settingsScreen");
};

/** 
 * Goes back to home menu 
 */
window.goToHome  = function () {
  cleanupWorldResources();
  location.reload();
};

/** 
 * Hides the music toggle button at the end of the game 
 */
function hideFooterButtonsAtEnd() {
  document.getElementById("music-toggle-button").style.display = "none";
}

/** 
 * Shows the footer when the game ends (mobile only) 
 */
function showFooterOnGameEnd() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
}

/**
 * Sets the visibility of the game buttons
 * @param {boolean} isVisible 
 */
function setButtonsVisibility(isVisible) {
  const display = isVisible ? 'inline-block' : 'none';
  document.getElementById('home-button').style.display = display;
  document.getElementById('music-toggle-button').style.display = display;
}

/** 
 * Hides the game buttons 
 */
function hideGameButtons() { 
  setButtonsVisibility(false);
}

/** 
 * Shows the game buttons 
 */
function showGameButtons() {
  setButtonsVisibility(true);
}

/** 
 * Initializes game buttons on page load 
 */
function initializeGameButtons() {
  hideGameButtons();
}

document.addEventListener("DOMContentLoaded", function () {
  initializeGameButtons();
}, { passive: true });

/**
 * Checks if the device is mobile
 * @returns {boolean}
 */
function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Updates the audio icon based on mute state
 * @param {boolean} isMuted 
 */
function updateAudioIcon(isMuted) {
  const audioIcon = document.getElementById("audio-icon");
  const iconPath = isMuted 
    ? "img_pollo_locco/img/10_buttons/sound-icon-off.png"
    : "img_pollo_locco/img/10_buttons/sound-icon-on.png";
  audioIcon.src = iconPath;
}

/** 
 * Toggles the audio of the game world 
 */
function toggleWorldAudio() {
  toggleSound(world);
  updateAudioIcon(isGameMuted);
}

/** 
 * Toggles the global audio state 
 */
function toggleGlobalAudio() {
  isMuted = !isMuted;
  updateAudioIcon(isMuted);
}

/** 
 * Toggles audio for mobile devices, depending on world state 
 */
function toggleMobileAudio() {
  if (window.world) {
    toggleWorldAudio();
  } else {
    toggleGlobalAudio();
  }
}

/** 
 * Shows the container with mobile controls 
 */
function showMobileControlsContainer() {
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.style.display = "flex";
  }
}

/**
 * Adds touch event listeners to an element for controlling keyboard keys
 * @param {HTMLElement} element 
 * @param {string} keyProperty 
 */
function addTouchEventListeners(element, keyProperty) {
  element.addEventListener("touchstart", () => {
    keyboard[keyProperty] = true;
  }, { passive: true });
  
  element.addEventListener("touchend", () => {
    keyboard[keyProperty] = false;
  }, { passive: true });
}

/**
 * Sets up a touch control element with optional callback
 * @param {string} elementId 
 * @param {string|null} keyProperty 
 * @param {Function|null} callback 
 */
function setupTouchControl(elementId, keyProperty, callback = null) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (callback) {
    element.addEventListener("touchstart", callback, { passive: false });
  } else {
    addTouchEventListeners(element, keyProperty);
  }
}

/** 
 * Sets up all touch controls for mobile 
 */
function setupAllTouchControls() {
  setupTouchControl("btn-home", null, () => window.goToHome());
  setupTouchControl("btn-left", "LEFT");
  setupTouchControl("btn-right", "RIGHT");
  setupTouchControl("btn-jump", "SPACE");
  setupTouchControl("btn-throw", "D");
  setupTouchControl("btn-audio", null, (e) => {
    e.preventDefault();
    toggleMobileAudio();
  });
}

/** 
 * Shows mobile controls and initializes touch events 
 */
function showMobileControls() {
  if (!isMobile()) return;
  
  showMobileControlsContainer();
  setupAllTouchControls();
}

/** 
 * Initializes mobile controls and orientation check 
 */
function initializeMobileAndOrientation() {
  showMobileControls();
  checkOrientation();
}

document.addEventListener("DOMContentLoaded", function () {
  initializeMobileAndOrientation();
}, { passive: true });

/**
 * Toggles the orientation overlay visibility based on portrait mode
 * @param {boolean} isPortrait 
 */
function toggleOrientationOverlay(isPortrait) {
  const overlay = document.getElementById("rotate-device-overlay");
  if (!overlay) return;
  overlay.style.display = isPortrait ? "flex" : "none";
}

/** 
 * Checks the screen orientation and toggles the overlay accordingly 
 */
function checkOrientation() {
  const isPortrait = window.innerHeight > window.innerWidth;
  toggleOrientationOverlay(isPortrait);
}

let resizeTimeout;

/** 
 * Throttles the orientation check on window resize events 
 */
function throttledCheckOrientation() {
  if (resizeTimeout) return; 
  resizeTimeout = requestAnimationFrame(() => {
    checkOrientation();
    resizeTimeout = null;
  });
}

/** 
 * Sets up event listeners for orientation changes and resizing 
 */
function setupOrientationListeners() {
  window.addEventListener("resize", throttledCheckOrientation, { passive: true });
  window.addEventListener("orientationchange", checkOrientation, { passive: true });
  document.addEventListener("DOMContentLoaded", checkOrientation, { passive: true });
}

setupKeydownListeners();
setupKeyupListeners();
setupOrientationListeners();