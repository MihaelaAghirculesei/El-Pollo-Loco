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
    if (!canvas) return;
    const aspect = 720 / 480;
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width / height > aspect) {
      width = height * aspect;
    } else {
      height = width / aspect;
    }
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
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
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const enterText = document.getElementById("fullscreen-enter-text");
  const exitText = document.getElementById("fullscreen-exit-text");
  const fullscreenElement = document.getElementById("fullscreen");

  // Aggiorna il testo del bottone in base allo stato fullscreen
  function updateFullscreenButton() {
    if (document.fullscreenElement) {
      enterText.style.display = "none";
      exitText.style.display = "inline";
    } else {
      enterText.style.display = "inline";
      exitText.style.display = "none";
    }
  }

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      Fullscreen.enterFullscreen(fullscreenElement);
    } else {
      Fullscreen.exitFullscreen();
    }
  });

  // Aggiorna il testo quando si entra/esce dal fullscreen
  document.addEventListener("fullscreenchange", updateFullscreenButton);

  window.addEventListener("resize", () => {
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
