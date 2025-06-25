import { World } from "../models/world.class.js";

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
window.hideFooterButtonsAtEnd = hideFooterButtonsAtEnd;
window.showFooterOnGameEnd = showFooterOnGameEnd;

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  window.world = world;
  world.startEnemiesAnimation();
  toggleSound(world);
}

function setupKeydownListeners() {
  window.addEventListener("keydown", (e) => {
    setKeyState(e.keyCode, true);
  });
}

function setupKeyupListeners() {
  window.addEventListener("keyup", (e) => {
    setKeyState(e.keyCode, false);
  });
}

function setKeyState(keyCode, state) {
  if (keyCode == 39) keyboard.RIGHT = state;
  if (keyCode == 37) keyboard.LEFT = state;
  if (keyCode == 38) keyboard.UP = state;
  if (keyCode == 40) keyboard.DOWN = state;
  if (keyCode == 32) keyboard.SPACE = state;
  if (keyCode == 68) keyboard.D = state;
}

function hideStartScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.body.classList.remove('start-screen-active');
}

function showMobileControlsIfNeeded() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "none";
    document.getElementById("mobile-controls").style.display = "flex";
  }
}

window.startGame = function () {
  showGameButtons();
  hideStartScreen();
  init();
  showMobileControlsIfNeeded();
};

function cleanupWorldResources() {
  if (world && world.gameInterval) {
    clearInterval(world.gameInterval);
  }
}

function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("content").style.display = "none";
  document.body.classList.add('start-screen-active');
}

function resetMobileControlsForMenu() {
  if (isMobile()) {
    document.getElementById("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
}

window.returnToMenu = function () {
  cleanupWorldResources();
  showStartScreen();
  resetMobileControlsForMenu();
  location.reload();
};

function showScreen(screenId) {
  document.getElementById(screenId).style.display = "flex";
  document.getElementById(screenId).style.backgroundColor = "white";
}

function hideScreen(screenId) {
  document.getElementById(screenId).style.display = "none";
}

window.openControls = function () {
  showScreen("controlsScreen");
};

window.closeControls = function () {
  hideScreen("controlsScreen");
};

window.openStory = function () {
  showScreen("storyScreen");
};

window.closeStory = function () {
  hideScreen("storyScreen");
};

window.openSettings = function () {
  showScreen("settingsScreen");
};

window.closeSettings = function () {
  hideScreen("settingsScreen");
};

window.restartGame = function () {
  cleanupWorldResources();
  location.reload();
};

function hideFooterButtonsAtEnd() {
  document.getElementById("music-toggle-button").style.display = "none";
}

function showFooterOnGameEnd() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
}

function setButtonsVisibility(isVisible) {
  const display = isVisible ? 'inline-block' : 'none';
  document.getElementById('restart-game-button').style.display = display;
  document.getElementById('music-toggle-button').style.display = display;
}

function hideGameButtons() { 
  setButtonsVisibility(false);
}

function showGameButtons() {
  setButtonsVisibility(true);
}

function initializeGameButtons() {
  hideGameButtons();
}

document.addEventListener("DOMContentLoaded", function () {
  initializeGameButtons();
}, { passive: true });

function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function updateAudioIcon(isMuted) {
  const audioIcon = document.getElementById("audio-icon");
  const iconPath = isMuted 
    ? "img_pollo_locco/img/10_buttons/sound-icon-off.png"
    : "img_pollo_locco/img/10_buttons/sound-icon-on.png";
  audioIcon.src = iconPath;
}

function toggleWorldAudio() {
  toggleSound(world);
  updateAudioIcon(isGameMuted);
}

function toggleGlobalAudio() {
  isMuted = !isMuted;
  updateAudioIcon(isMuted);
}

function toggleMobileAudio() {
  if (window.world) {
    toggleWorldAudio();
  } else {
    toggleGlobalAudio();
  }
}

function showMobileControlsContainer() {
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.style.display = "flex";
  }
}

function addTouchEventListeners(element, keyProperty) {
  element.addEventListener("touchstart", () => {
    keyboard[keyProperty] = true;
  }, { passive: true });
  
  element.addEventListener("touchend", () => {
    keyboard[keyProperty] = false;
  }, { passive: true });
}

function setupTouchControl(elementId, keyProperty, callback = null) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (callback) {
    element.addEventListener("touchstart", callback, { passive: false });
  } else {
    addTouchEventListeners(element, keyProperty);
  }
}

function setupAllTouchControls() {
  setupTouchControl("btn-restart", null, () => window.restartGame());
  setupTouchControl("btn-left", "LEFT");
  setupTouchControl("btn-right", "RIGHT");
  setupTouchControl("btn-jump", "SPACE");
  setupTouchControl("btn-throw", "D");
  setupTouchControl("btn-audio", null, (e) => {
    e.preventDefault();
    toggleMobileAudio();
  });
}

function showMobileControls() {
  if (!isMobile()) return;
  
  showMobileControlsContainer();
  setupAllTouchControls();
}

function initializeMobileAndOrientation() {
  showMobileControls();
  checkOrientation();
}

document.addEventListener("DOMContentLoaded", function () {
  initializeMobileAndOrientation();
}, { passive: true });

function toggleOrientationOverlay(isPortrait) {
  const overlay = document.getElementById("rotate-device-overlay");
  if (!overlay) return;
  overlay.style.display = isPortrait ? "flex" : "none";
}

function checkOrientation() {
  const isPortrait = window.innerHeight > window.innerWidth;
  toggleOrientationOverlay(isPortrait);
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

setupKeydownListeners();
setupKeyupListeners();
setupOrientationListeners();