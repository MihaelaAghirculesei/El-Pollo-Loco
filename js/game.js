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

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

window.startGame = function () {
  showExpandScreenButton();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("content").style.display = "block";
  setTimeout(() => {
    init();
    if (isMobile()) {
      document.querySelector("footer").style.display = "none";
      document.getElementById("mobile-controls").style.display = "flex";
    }
  }, 1000);
};

window.returnToMenu = function () {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("content").style.display = "none";
  if (isMobile()) {
    document.getElementById("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
  location.reload();
};

window.openControls = function () {
  document.getElementById("controlsScreen").style.display = "flex";
  document.getElementById("controlsScreen").style.backgroundColor = "white";
};

window.closeControls = function () {
  document.getElementById("controlsScreen").style.display = "none";
};

window.openStory = function () {
  document.getElementById("storyScreen").style.display = "flex";
  document.getElementById("storyScreen").style.backgroundColor = "white";
};

window.closeStory = function () {
  document.getElementById("storyScreen").style.display = "none";
};

window.openSettings = function () {
  document.getElementById("settingsScreen").style.display = "flex";
  document.getElementById("settingsScreen").style.backgroundColor = "white";
};

window.closeSettings = function () {
  document.getElementById("settingsScreen").style.display = "none";
};

window.restartGame = function () {
  location.reload();
};

function hideFooterButtonsAtEnd() {
  document.getElementById("expand-screen-btn").style.display = "none";
  document.getElementById("music-toggle-button").style.display = "none";
}

function showFooterOnGameEnd() {
  if (isMobile()) {
    document.querySelector("footer").style.display = "flex";
    document.getElementById("mobile-controls").style.display = "none";
  }
}

function showFooterButtons() {
  document.getElementById("expand-screen-btn").style.display = "";
  document.getElementById("music-toggle-button").style.display = "";
}

function hideExpandScreenButton() {
  document.getElementById("expand-screen-btn").style.display = "none";
}

function showExpandScreenButton() {
  document.getElementById("expand-screen-btn").style.display = "";
}

window.hideExpandScreenButton = hideExpandScreenButton;
window.showExpandScreenButton = showExpandScreenButton;

document.addEventListener("DOMContentLoaded", function () {
  hideExpandScreenButton();
}, { passive: true });

function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function toggleMobileAudio() {
  const audioIcon = document.getElementById("audio-icon");

  if (window.world) {
    toggleSound(world);
    const isMuted =
      world.soundMuted ||
      (world.character &&
        world.character.world &&
        world.character.world.soundMuted);
    audioIcon.src = isMuted
      ? "img_pollo_locco/img/10_buttons/sound-icon-off.png"
      : "img_pollo_locco/img/10_buttons/sound-icon-on.png";
  } else {
    isMuted = !isMuted;
    audioIcon.src = isMuted
      ? "img_pollo_locco/img/10_buttons/sound-icon-off.png"
      : "img_pollo_locco/img/10_buttons/sound-icon-on.png";
  }
}

function showMobileControls() {
  if (isMobile()) {
    document.getElementById("mobile-controls").style.display = "flex";

    document.getElementById("btn-restart").addEventListener("touchstart", () => {
      window.restartGame();
    }, { passive: true });

    document.getElementById("btn-left").addEventListener("touchstart", () => {
      keyboard.LEFT = true;
    }, { passive: true });
    document.getElementById("btn-left").addEventListener("touchend", () => {
      keyboard.LEFT = false;
    }, { passive: true });

    document.getElementById("btn-right").addEventListener("touchstart", () => {
      keyboard.RIGHT = true;
    }, { passive: true });
    document.getElementById("btn-right").addEventListener("touchend", () => {
      keyboard.RIGHT = false;
    }, { passive: true });

    document.getElementById("btn-jump").addEventListener("touchstart", () => {
      keyboard.SPACE = true;
    }, { passive: true });
    document.getElementById("btn-jump").addEventListener("touchend", () => {
      keyboard.SPACE = false;
    }, { passive: true });

    document.getElementById("btn-throw").addEventListener("touchstart", () => {
      keyboard.D = true;
    }, { passive: true });
    document.getElementById("btn-throw").addEventListener("touchend", () => {
      keyboard.D = false;
    }, { passive: true });

    document.getElementById("btn-audio").addEventListener("touchstart", (e) => {
      e.preventDefault();
      toggleMobileAudio();
    }, { passive: false });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  showMobileControls();
  checkOrientation();
}, { passive: true });

function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  if (window.innerHeight > window.innerWidth) {
    if (!overlay) return;
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

window.addEventListener("resize", checkOrientation, { passive: true });
window.addEventListener("orientationchange", checkOrientation, { passive: true });
document.addEventListener("DOMContentLoaded", checkOrientation, { passive: true });
