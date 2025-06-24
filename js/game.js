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
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
  });
}

function setupKeyupListeners() {
  window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
  });
}

function hideStartScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.body.classList.remove('start-screen-active');
}

function handleMobileControlsVisibility() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "none";
    document.getElementById("mobile-controls").style.display = "flex";
  }
}

window.startGame = function () {
  showGameButtons();
  hideStartScreen();
  init();
  handleMobileControlsVisibility();
};

function handleMobileControls() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "none";
    document.getElementById("mobile-controls").style.display = "flex";
  }
}

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

function showControlsScreen() {
  document.getElementById("controlsScreen").style.display = "flex";
  document.getElementById("controlsScreen").style.backgroundColor = "white";
}

function hideControlsScreen() {
  document.getElementById("controlsScreen").style.display = "none";
}

window.openControls = function () {
  showControlsScreen();
};

window.closeControls = function () {
  hideControlsScreen();
};

function showStoryScreen() {
  document.getElementById("storyScreen").style.display = "flex";
  document.getElementById("storyScreen").style.backgroundColor = "white";
}

function hideStoryScreen() {
  document.getElementById("storyScreen").style.display = "none";
}

window.openStory = function () {
  showStoryScreen();
};

window.closeStory = function () {
  hideStoryScreen();
};

function showSettingsScreen() {
  document.getElementById("settingsScreen").style.display = "flex";
  document.getElementById("settingsScreen").style.backgroundColor = "white";
}

function hideSettingsScreen() {
  document.getElementById("settingsScreen").style.display = "none";
}

window.openSettings = function () {
  showSettingsScreen();
};

window.closeSettings = function () {
  hideSettingsScreen();
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

function hideGameButtons() { 
  document.getElementById('restart-game-button').style.display = 'none';
  document.getElementById('music-toggle-button').style.display = 'none';
}

function showGameButtons() {
  document.getElementById('restart-game-button').style.display = 'inline-block';
  document.getElementById('music-toggle-button').style.display = 'inline-block';
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
  audioIcon.src = isMuted
    ? "img_pollo_locco/img/10_buttons/sound-icon-off.png"
    : "img_pollo_locco/img/10_buttons/sound-icon-on.png";
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

function setupTouchControl(elementId, keyProperty, callback = null) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (callback) {
    element.addEventListener("touchstart", callback, { passive: false });
  } else {
    element.addEventListener("touchstart", () => {
      keyboard[keyProperty] = true;
    }, { passive: true });
    
    element.addEventListener("touchend", () => {
      keyboard[keyProperty] = false;
    }, { passive: true });
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