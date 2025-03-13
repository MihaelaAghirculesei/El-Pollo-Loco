let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    playBackgroundMusic()
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
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
        keyboard.UP = true;
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

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById('content').style.display = 'block';
    setTimeout(() => {
        init();
    }, 300);
}

function openControls() {
    document.getElementById("controlsScreen").style.display = "flex";
    document.getElementById("controlsScreen").style.backgroundColor = "white";
}

function closeControls() {
    document.getElementById("controlsScreen").style.display = "none";
}

function openStory() {
    document.getElementById("storyScreen").style.display = "flex";
    document.getElementById("storyScreen").style.backgroundColor = "white";
}

function closeStory() {
    document.getElementById("storyScreen").style.display = "none";
}

function openSettings() {
    document.getElementById("settingsScreen").style.display = "flex";
    document.getElementById("settingsScreen").style.backgroundColor = "white";
}

function closeSettings() {
    document.getElementById("settingsScreen").style.display = "none";
}

function restartGame() {
    console.log("Spiel wird neu gestartet!");
    location.reload(); 
}
