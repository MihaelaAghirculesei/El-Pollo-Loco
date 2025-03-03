class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 700;
    

    constructor(enemies, clouds, coins, bottle, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottle = bottle;
        this.backgroundObjects = backgroundObjects;
        }
}