/**
 * A smaller, faster chicken. Same lifecycle as {@link Chicken}; only the
 * spec differs (sprites, size, speed, one hit point).
 */
class SmallChicken extends Chicken {
  /**
   * @returns {ReturnType<Chicken['spec']>}
   */
  spec() {
    return {
      walking: [
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      dead: ["img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png"],
      width: 60,
      height: 60,
      spawnX: 600,
      spawnRange: 4000,
      minSpeed: 0.15,
      speedRange: 0.3,
      health: 1,
      removalDelay: 90,
    };
  }
}
