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
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

let animating = false;

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

function animateParticles() {
  if (!titleVisible()) {
    animating = false;
    return;
  }
  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
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
