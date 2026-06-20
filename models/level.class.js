class Level {
    enemies;
    coins;
    backgroundObjects;
    levelEnd_x = 1440;

    constructor(enemies, coins, backgroundObjects) {
        this.enemies = enemies;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
    }
}
