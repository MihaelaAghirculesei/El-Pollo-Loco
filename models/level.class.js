/**
 * Class representing a game level.
 */
class Level {
  level_end_x = 700;

  /**
   * Creates a level instance.
   * @param {Array} enemies - Array of enemy objects
   * @param {Array} clouds - Array of cloud objects
   * @param {Array} coins - Array of coin objects
   * @param {Object} bottle - Bottle object
   * @param {Array} backgroundObjects - Array of background objects
   */
  constructor(enemies, clouds, coins, bottle, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.coins = coins;
    this.bottle = bottle;
    this.backgroundObjects = backgroundObjects;
  }
}