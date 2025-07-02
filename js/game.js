import { World } from "../models/world.class.js";

let canvas, world, keyboard = new Keyboard(), isMuted = false;

window.showFooterOnGameEnd = showFooterOnGameEnd;

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  window.world = world;
  world.startEnemiesAnimation();
  syncAudioStates();
}

function syncAudioStates() {
  isMuted = audioManager.isGameMuted;
  isGameMuted = audioManager.isGameMuted;
  updateAudioIcon(isMuted);
  audioManager.updateAllButtons();
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

function showMobileControlsIfNeeded() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "none";
    document.getElementById("mobile-controls").style.display = "flex";
  }
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
  if (isMobile()) {
    document.querySelector("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
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
    document.querySelector("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
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
    syncAudioStates();
  }, 100);
}

function handleDOMContentLoaded() {
  setFooterButtonsVisibility(false);
  initializeAudioSync();
}

function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function updateAudioIcon(isMuted) {
  const audioIcon = document.getElementById("audio-icon");
  if (audioIcon) {
    audioIcon.src = `img_pollo_locco/img/10_buttons/sound-icon-${isMuted ? 'off' : 'on'}.png`;
  }
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
    ["btn-audio", null, (e) => { e.preventDefault(); toggleGlobalAudio(); }]
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

window.pauseGame = function() {
  const menuOverlay = document.getElementById('menu-overlay');
  if (menuOverlay) menuOverlay.classList.remove('d_none');
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
  const menuOverlay = document.getElementById('menu-overlay');
  if (menuOverlay) menuOverlay.classList.add('d_none');
};

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, { passive: true });
document.addEventListener("DOMContentLoaded", initializeMobileAndOrientation, { passive: true });

setupKeyListeners();
setupOrientationListeners();