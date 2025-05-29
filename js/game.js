import { World } from "../models/world.class.js";

let canvas;
let world;
let keyboard = new Keyboard();
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
    showExpandScreenButton();
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("content").style.display = "block";
    setTimeout(() => {
        init();
        if (isMobile()) {
            document.querySelector('footer').style.display = 'none';
            document.getElementById('mobile-controls').style.display = 'flex';
        }
    }, 1000); 
};

window.returnToMenu = function() {
    document.getElementById("startScreen").style.display = "flex";
    document.getElementById("content").style.display = "none";
    if (isMobile()) {
        document.getElementById('footer').style.display = 'flex';
        document.getElementById('mobile-controls').style.display = 'none';
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
  document.getElementById('expand-screen-btn').style.display = 'none';
  document.getElementById('music-toggle-button').style.display = 'none';
}

function showFooterOnGameEnd() {
  if (isMobile()) {
    document.querySelector('footer').style.display = 'flex';
    document.getElementById('mobile-controls').style.display = 'none';
  }
}

function showFooterButtons() {
  document.getElementById('expand-screen-btn').style.display = '';
  document.getElementById('music-toggle-button').style.display = '';
}

function hideExpandScreenButton() {
  document.getElementById('expand-screen-btn').style.display = 'none';
}

function showExpandScreenButton() {
  document.getElementById('expand-screen-btn').style.display = '';
}
window.hideExpandScreenButton = hideExpandScreenButton;
window.showExpandScreenButton = showExpandScreenButton;

document.addEventListener("DOMContentLoaded", function() {
    hideExpandScreenButton();
});

function isMobile() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function showMobileControls() {
  if (isMobile()) {
    document.getElementById('mobile-controls').style.display = 'flex';
    document.getElementById('btn-restart').ontouchstart = () => {
    window.restartGame();
    };
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