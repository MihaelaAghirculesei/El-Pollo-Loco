/**
 * Creates a list of objects using a constructor and an array of positions.
 * @param {Function} Constructor - The constructor function for the objects to create.
 * @param {Array} positions - An array of positions (either single values or arrays of values).
 * @returns {Array} - An array of instantiated objects.
 */
function createObjects(Constructor, positions) {
  return positions.map(pos => new Constructor(...(Array.isArray(pos) ? pos : [pos])));
}

// Positions of big chickens in the level
const chickenPositions = [850, 1000, 1500, 2000, 2500, 3000, 3500];

// Positions of small chickens in the level
const smallChickenPositions = [650, 1750, 1800, 2750, 3150, 3450, 3750, 4150];

// Positions of clouds in the background
const cloudPositions = [100, 500, 900, 1300, 1700, 2100, 2500, 2900, 3300, 3700, 4100, 4500, 4700, 5000, 5500, 6300, 7000];

// Positions of coins (x, y)
const coinPositions = [
  [300, 300], [350, 300], [400, 300], [450, 300], [500, 200], [550, 200], [600, 200], [650, 200],
  [750, 100], [800, 100], [850, 100], [900, 100],
  [1350, 300], [1400, 300], [1450, 300], [1500, 300], [1550, 200], [1600, 200], [1650, 200], [1700, 200],
  [1850, 300], [1900, 300], [1950, 300], [2000, 300],
  [2350, 100], [2400, 100], [2450, 100], [2500, 100], [2550, 200], [2600, 200], [2650, 200], [2700, 200],
];

// Positions of bottles (x, y)
const bottlePositions = [
  [180, 370], [200, 370], [215, 370], [230, 370], [245, 370], [260, 370],
  [855, 370], [875, 370], [895, 370], [915, 370], [935, 370], [955, 370],
  [1550, 370], [1900, 370], [2700, 370], [2400, 370], [1800, 370],
  [1645, 370], [1665, 370], [1685, 370], [1705, 370], [1725, 370],
  [3645, 370], [3665, 370], [3685, 370], [3705, 370], [3725, 370],
];

// Paths and X positions of background images for the parallax effect
const backgroundPositions = [
  ["img_pollo_locco/img/5_background/layers/air.png", -719],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719],
  ["img_pollo_locco/img/5_background/layers/air.png", 0],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0],
  ["img_pollo_locco/img/5_background/layers/air.png", 719],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 2],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 2],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 2],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 2],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 3],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 3],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 3],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 3],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 4],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 4],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 4],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 4],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 5],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 5],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 5],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 5],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 6],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 6],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 6],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 6],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 7],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 7],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 7],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 7],
  ["img_pollo_locco/img/5_background/layers/air.png", 719 * 8],
  ["img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 8],
  ["img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 8],
  ["img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 8],
];

/**
 * Builds a fresh level 1 with its own new enemies, clouds, coins, bottles
 * and background objects. Called once per game so a restart never reuses
 * entities from the previous run.
 * @returns {Level} A new level instance
 */
function buildLevel1() {
  return new Level(
    [
      ...createObjects(Chicken, chickenPositions),
      ...createObjects(SmallChicken, smallChickenPositions),
    ],
    createObjects(Cloud, cloudPositions),
    createObjects(Coin, coinPositions),
    createObjects(Bottle, bottlePositions),
    createObjects(BackgroundObjekt, backgroundPositions)
  );
}

// Build one level at load and drop it: the entities are discarded, but
// their sprite paths stay in DrawableObject.imagePool and start decoding
// now, so the first game — and every in-place restart — starts warm.
buildLevel1();

/**
 * Character, Endboss and the four status bars are built directly by
 * World, not by buildLevel1(), so their sprites never entered the pool
 * above and used to decode cold on the game's very first drawn frames
 * instead. Pooling their paths puts them through the same warmup as
 * everything else — but registering them (like buildLevel1()'s own
 * images) fires the actual network fetch immediately, and this is ~2-3MB
 * more of it across bigger sprite sheets. Done eagerly, that competed
 * with the start screen's own critical resources for bandwidth and
 * tanked the Lighthouse performance score; it's deferred to idle time
 * below instead, same as the title particle animation.
 */
function warmExtraSprites() {
  [
    ...Character.getAllImagePaths(),
    ...Endboss.getAllImagePaths(),
    ...StatusBarHeartCharacter.IMAGES,
    ...StatusBarHeartEndboss.IMAGES,
    ...StatusBarBottle.IMAGES,
    ...StatusBarCoins.IMAGES,
  ].forEach((path) => DrawableObject.getImage(path, { lowPriority: true }));
}

let spriteWarmup;

/**
 * Blits every image in small batches spread across idle callbacks instead
 * of one synchronous loop, so warming 150+ sprites (once Character/Endboss/
 * status-bar sheets joined the pool) never becomes a single long main-thread
 * task — that showed up in Lighthouse as ~1.6s of Total Blocking Time even
 * though it never delayed anything the player could see.
 * @param {HTMLImageElement[]} images - Pooled images to blit
 * @param {CanvasRenderingContext2D} scratch - Off-screen context to draw into
 * @returns {Promise<void>} Resolves once every image has been blitted
 */
function blitAllIdle(images, scratch) {
  // Hard cap per callback: a starved requestIdleCallback still fires with
  // didTimeout=true, and that must never mean "drain everything remaining
  // in one go" — this bounds the worst case to a handful of sprites.
  const MAX_PER_SLICE = 2;
  return new Promise((resolve) => {
    let i = 0;
    const blitOne = (img) => { try { scratch.drawImage(img, 0, 0); } catch { /* unusable sprite */ } };
    function scheduleNext() {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(stepIdle, { timeout: 50 });
      } else {
        setTimeout(stepChunk, 0);
      }
    }
    function stepIdle(deadline) {
      const end = Math.min(i + MAX_PER_SLICE, images.length);
      while (i < end && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
        blitOne(images[i]);
        i++;
      }
      i < images.length ? scheduleNext() : resolve();
    }
    function stepChunk() {
      const end = Math.min(i + MAX_PER_SLICE, images.length);
      for (; i < end; i++) blitOne(images[i]);
      i < images.length ? scheduleNext() : resolve();
    }
    images.length ? scheduleNext() : resolve();
  });
}

/**
 * Resolves once every pooled sprite has decoded and been blitted once, so
 * the game's first real frame never pays a synchronous decode (that was
 * blocking the first rAF for ~300-400 ms on a cold cache). Memoised:
 * fired once idle while the start screen is up, and awaited again by the
 * game bootstrap — instant on every run after the first.
 */
function warmSpritePool() {
  if (spriteWarmup) return spriteWarmup;
  const images = Object.values(DrawableObject.imagePool);
  const scratch = document.createElement("canvas").getContext("2d");
  spriteWarmup = Promise.allSettled(
    images.map((img) =>
      typeof img.decode === "function" ? img.decode() : Promise.resolve()
    )
  ).then(() => blitAllIdle(images, scratch));
  return spriteWarmup;
}

function startIdleWarmup() {
  warmExtraSprites();
  warmSpritePool();
}

/**
 * requestIdleCallback only guarantees the main thread is free — on a cold
 * cache the browser can still be mid-download of the start screen's own
 * critical resources when it fires, so this extra warmup would still
 * fight them for bandwidth (that's what dropped the incognito/cold-cache
 * Lighthouse score even with lowPriority fetches queued). Waiting for the
 * window's load event first means those critical resources have already
 * finished, and only then does idle time (or its timeout) kick this off.
 */
function scheduleIdleWarmup() {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(startIdleWarmup, { timeout: 500 });
  } else {
    setTimeout(startIdleWarmup, 0);
  }
}

if (document.readyState === "complete") {
  scheduleIdleWarmup();
} else {
  window.addEventListener("load", scheduleIdleWarmup, { once: true });
}
