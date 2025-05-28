class ExpandScreen  {
  static enterExpandScreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    }
    this.resizeCanvas();
  }

  static exitExpandScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    this.resetCanvas();
  }

  static resizeCanvas() {
const canvas = document.getElementById("canvas");
  if (!canvas) return;
  if (document.fullscreenElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '100vw';
    canvas.style.height = '100dvh'; 
  } else {
    canvas.width = 720;
    canvas.height = 480;
    canvas.style.width = '';
    canvas.style.height = '';
    }
  }

  static resetCanvas() {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.width = 720;
      canvas.height = 480;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const expandScreenBtn = document.getElementById("expand-screen-btn");
  const enterText = document.getElementById("expand-screen-enter-text");
  const exitText = document.getElementById("expand-screen-exit-text");
  const expandScreenElement = document.getElementById("expand-screen");

  function updateExpandScreenButton() {
    if (document.fullscreenElement) {
      enterText.style.display = "none";
      exitText.style.display = "inline";
    } else {
      enterText.style.display = "inline";
      exitText.style.display = "none";
    }
  }

  expandScreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      ExpandScreen.enterExpandScreen(expandScreenElement);
    } else {
      ExpandScreen.exitExpandScreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    updateExpandScreenButton();
    ExpandScreen.resizeCanvas();
  });

  window.addEventListener("resize", () => {
    if (document.fullscreenElement) {
      ExpandScreen.resizeCanvas();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (document.fullscreenElement && event.code === "Space") {
      event.preventDefault();
    }
  });
});

