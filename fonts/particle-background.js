/**
 * Purely decorative title animation. Deferred to idle time so its
 * setup (a forced layout read plus 50 particle objects) never competes
 * with the game class scripts for main-thread time right after parse.
 */
function setUpTitleParticles() {
  const h1 = document.querySelector("h1");
  const particleCanvas = document.createElement("canvas");
  const ctx = particleCanvas.getContext("2d");

  h1.style.position = "relative";
  h1.appendChild(particleCanvas);

  particleCanvas.style.position = "absolute";
  particleCanvas.style.top = "0";
  particleCanvas.style.left = "0";
  particleCanvas.style.width = "100%";
  particleCanvas.style.height = "100%";
  particleCanvas.style.zIndex = "-1";

  particleCanvas.width = h1.clientWidth;
  particleCanvas.height = h1.clientHeight;

  const particles = [];
  const numParticles = 50;

  /**
   * A single circle rasterized once and reused for every particle every
   * frame. Filling an arc() path per particle forces the canvas to
   * re-tessellate and anti-alias a curve 50 times a frame, which is what
   * pushed this handler past 50ms; drawImage()-ing a pre-rendered sprite
   * is a cheap blit instead.
   */
  const spriteSize = 10;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = spriteSize;
  const spriteCtx = sprite.getContext("2d");
  spriteCtx.fillStyle = "#fff";
  spriteCtx.beginPath();
  spriteCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2, 0, Math.PI * 2);
  spriteCtx.fill();

  class Particle {
    constructor() {
      this.x = Math.random() * particleCanvas.width;
      this.y = Math.random() * particleCanvas.height;
      this.size = Math.random() * 4 + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(sprite, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }
  }

  function initParticles() {
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  let animating = false;
  let lastFrameTime = 0;
  const frameInterval = 1000 / 30;

  /**
   * The title is only visible on the start/menu screens. When it isn't
   * (a game is running) or the tab is hidden, the loop stops rescheduling
   * itself entirely instead of waking every frame just to bail out, so it
   * never lands in a busy frame's rAF batch during gameplay. `resume`
   * restarts it when the start screen or the tab comes back.
   */
  function titleVisible() {
    return !document.hidden && document.body.classList.contains("start-screen-active");
  }

  /**
   * Purely decorative, so it's capped at 30fps instead of riding every
   * rAF tick: half the draw calls per second for a still-smooth drift.
   */
  function animateParticles(now) {
    if (!titleVisible()) {
      animating = false;
      return;
    }
    requestAnimationFrame(animateParticles);
    if (now - lastFrameTime < frameInterval) return;
    lastFrameTime = now;

    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    ctx.globalAlpha = 1;
  }

  function resume() {
    if (animating || !titleVisible()) return;
    animating = true;
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => {
    particleCanvas.width = h1.clientWidth;
    particleCanvas.height = h1.clientHeight;
  });

  document.addEventListener("visibilitychange", resume);
  new MutationObserver(resume).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  initParticles();
  resume();
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(setUpTitleParticles, { timeout: 500 });
} else {
  setTimeout(setUpTitleParticles, 0);
}
