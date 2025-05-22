import { World } from "../models/world.class.js";

let canvas;
let world;
let keyboard = new Keyboard();
window.hideFooterButtonsAtEnd = hideFooterButtonsAtEnd;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    window.world = world;
    toggleSound(world);
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});

window.startGame = function () {
    showFullscreenButton();
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("content").style.display = "block";
    setTimeout(() => {
        init();
        // Footer auf Mobilgeräten nach 3 Sekunden ausblenden
        if (isMobile()) {
            document.querySelector('footer').style.display = 'none';
        }
    }, 3000); // 3 Sekunden warten
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
  document.getElementById('fullscreen-btn').style.display = 'none';
  document.getElementById('music-toggle-button').style.display = 'none';
}

function showFooterButtons() {
  document.getElementById('fullscreen-btn').style.display = '';
  document.getElementById('music-toggle-button').style.display = '';
}

function hideFullscreenButton() {
  document.getElementById('fullscreen-btn').style.display = 'none';
}

function showFullscreenButton() {
  document.getElementById('fullscreen-btn').style.display = '';
}
window.hideFullscreenButton = hideFullscreenButton;
window.showFullscreenButton = showFullscreenButton;

document.addEventListener("DOMContentLoaded", function() {
    hideFullscreenButton();
});

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function showMobileControls() {
  if (isMobile()) {
    document.getElementById('mobile-controls').style.display = '';

    // Event Listener für Buttons
    document.getElementById('btn-left').ontouchstart = () => keyboard.LEFT = true;
    document.getElementById('btn-left').ontouchend = () => keyboard.LEFT = false;
    document.getElementById('btn-right').ontouchstart = () => keyboard.RIGHT = true;
    document.getElementById('btn-right').ontouchend = () => keyboard.RIGHT = false;
    document.getElementById('btn-jump').ontouchstart = () => keyboard.SPACE = true;
    document.getElementById('btn-jump').ontouchend = () => keyboard.SPACE = false;
    document.getElementById('btn-throw').ontouchstart = () => keyboard.D = true; 
    document.getElementById('btn-throw').ontouchend = () => keyboard.D = false;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showMobileControls();
  checkOrientation();
});

function checkOrientation() {
  const overlay = document.getElementById('rotate-device-overlay');
  // Overlay zeigen, wenn Fenster höher als breit ist (Portrait)
  if (window.innerHeight > window.innerWidth) {
     if (!overlay) return;
    overlay.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
  }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
document.addEventListener('DOMContentLoaded', checkOrientation);