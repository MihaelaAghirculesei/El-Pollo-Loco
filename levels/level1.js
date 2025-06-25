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
 * Initializes level 1 with all objects (enemies, clouds, coins, bottles, background).
 */
const level1 = new Level(
  [
    ...createObjects(Chicken, chickenPositions),
    ...createObjects(SmallChicken, smallChickenPositions),
  ],
  createObjects(Cloud, cloudPositions),
  createObjects(Coin, coinPositions),
  createObjects(Bottle, bottlePositions),
  createObjects(BackgroundObjekt, backgroundPositions)
);
