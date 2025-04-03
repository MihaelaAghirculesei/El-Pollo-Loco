class Fullscreen {
  static enterFullscreen(element) {
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

  static exitFullscreen() {
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  static resetCanvas() {
    const canvas = document.getElementById("canvas");
    canvas.width = 720;
    canvas.height = 480;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const enterText = document.getElementById("enter-text");
  const exitText = document.getElementById("exit-text");
  const fullscreenElement = document.getElementById("fullscreen");

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      Fullscreen.enterFullscreen(fullscreenElement);
      enterText.style.display = "none";
      exitText.style.display = "inline";
    } else {
      Fullscreen.exitFullscreen();
      enterText.style.display = "inline";
      exitText.style.display = "none";
    }
  });

  document.addEventListener("resize", () => {
    if (document.fullscreenElement) {
      Fullscreen.resizeCanvas();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (document.fullscreenElement && event.code === "Space") {
      event.preventDefault();
    }
  });
});