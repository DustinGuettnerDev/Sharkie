/**
 * Creates the first level with enemies, collectibles, backgrounds, and the end boss.
 * @returns {Level} The generated level object.
 */
function createLevel_1() {
    return new Level(
        createLevel1Enemies(),
        createLevel1Endboss(),
        createLevel1Collectibles(),
        createLevel1BackgroundObjects(),
        -1,
        8000,
    );
}


const = [Puffer,]

/**
 * Creates and configures the level 1 endboss.
 * @returns {Endboss} Configured endboss instance.
 */
function createLevel1Endboss() {
    const endboss = new Endboss();
    endboss.x = 7400;
    endboss.appearingPositionTrigger = 6800;
    return endboss;
}

/**
 * Creates all regular enemies for level 1.
 * @returns {(Puffer|JellyFish)[]} Enemy list.
 */
function createLevel1Enemies() {
    return [
        ...createLevel1EnemyWave1(),
        ...createLevel1EnemyWave2(),
        ...createLevel1EnemyWave3(),
        ...createLevel1EnemyWave4(),
    ];
}

/**
 * Creates the first enemy wave for level 1.
 * @returns {(Puffer|JellyFish)[]} Enemy wave.
 */
function createLevel1EnemyWave1() {
    return [
        new Puffer(350, 0.5),
        new JellyFish(550, 0.7),
        new Puffer(950, 1),
        new Puffer(1350, 0.6),
        new JellyFish(1550, 1.4),
        new Puffer(2100, 0.8),
        new JellyFish(2400, 0.9),
        new Puffer(2700, 1.8),
    ];
}

/**
 * Creates the second enemy wave for level 1.
 * @returns {(Puffer|JellyFish)[]} Enemy wave.
 */
function createLevel1EnemyWave2() {
    return [
        new Puffer(2900, 1.3),
        new JellyFish(3000, 0.9),
        new Puffer(3450, 0.7),
        new JellyFish(3700, 1.1),
        new Puffer(3950, 1.4),
        new JellyFish(4200, 0.8),
        new Puffer(4550, 1.7),
        new JellyFish(4850, 1.2),
    ];
}

/**
 * Creates the third enemy wave for level 1.
 * @returns {(Puffer|JellyFish)[]} Enemy wave.
 */
function createLevel1EnemyWave3() {
    return [
        new Puffer(5150, 0.9),
        new JellyFish(5450, 1.5),
        new Puffer(5750, 1.1),
        new JellyFish(6050, 0.75),
        new Puffer(6350, 1.9),
        new JellyFish(6650, 1.3),
        new Puffer(6950, 1.6),
        new JellyFish(7200, 1),
    ];
}

/**
 * Creates the final enemy wave for level 1.
 * @returns {(Puffer|JellyFish)[]} Enemy wave.
 */
function createLevel1EnemyWave4() {
    return [
        new Puffer(7480, 2),
        new Puffer(7700, 1),
        new JellyFish(7720, 1.35),
        new Puffer(7780, 0.6),
        new JellyFish(7800, 0.8),
        new JellyFish(8800, 0.8),
        new JellyFish(9000, 0.35),
        new Puffer(8900, 0.6),
    ];
}

/**
 * Creates all collectibles for level 1.
 * @returns {(Coin|PoisonBottle)[]} Collectible list.
 */
function createLevel1Collectibles() {
    return [
        ...createLevel1CoinArcsEarly(),
        ...createLevel1CoinArcsMid(),
        ...createLevel1CoinArcsLate(),
        ...createLevel1PoisonBottles(),
    ];
}

/**
 * Creates early coin arcs and single pickups.
 * @returns {Coin[]} Coin list.
 */
function createLevel1CoinArcsEarly() {
    return [
        new Coin(420, 400),
        new Coin(490, 330),
        new Coin(600, 300),
        new Coin(700, 300),
        new Coin(790, 330),
        new Coin(860, 400),
        new Coin(1600, 100),
        new Coin(2195, 400),
        new Coin(2265, 330),
        new Coin(2375, 300),
        new Coin(2475, 300),
        new Coin(2565, 330),
        new Coin(2635, 400),
        new Coin(4100, 250),
    ];
}

/**
 * Creates middle coin arcs through the core level section.
 * @returns {Coin[]} Coin list.
 */
function createLevel1CoinArcsMid() {
    return [
        new Coin(4500, 120),
        new Coin(4580, 180),
        new Coin(4660, 250),
        new Coin(4740, 340),
        new Coin(4820, 250),
        new Coin(4900, 180),
        new Coin(4980, 120),
        new Coin(5450, 400),
        new Coin(5520, 330),
        new Coin(5630, 300),
        new Coin(5730, 300),
        new Coin(5820, 330),
        new Coin(5890, 400),
    ];
}

/**
 * Creates late coin arcs near the end of the level.
 * @returns {Coin[]} Coin list.
 */
function createLevel1CoinArcsLate() {
    return [
        new Coin(6350, 110),
        new Coin(6460, 170),
        new Coin(6570, 240),
        new Coin(6680, 320),
        new Coin(6790, 380),
        new Coin(6900, 320),
        new Coin(7010, 240),
        new Coin(7120, 170),
        new Coin(7230, 110),
        new Coin(7480, 390),
        new Coin(7560, 330),
        new Coin(7660, 290),
        new Coin(7760, 290),
        new Coin(7860, 330),
        new Coin(7940, 390),
    ];
}

/**
 * Creates poison bottle collectibles for level 1.
 * @returns {PoisonBottle[]} Poison bottle list.
 */
function createLevel1PoisonBottles() {
    return [
        new PoisonBottle(625, 400, true),
        new PoisonBottle(2400, 400, false),
        new PoisonBottle(5200, 390, false),
        new PoisonBottle(7050, 390, true),
    ];
}

/**
 * Creates all background layers for level 1.
 * @returns {BackgroundObject[]} Background object list.
 */
function createLevel1BackgroundObjects() {
    const backgroundObjects = [];
    addBackgroundColumn(backgroundObjects, -720, 2, false);

    for (let x = 0; x <= 9360; x += 720) {
        const variant = x % 1440 === 0 ? 1 : 2;
        const includeLight = x === 0 || x === 720;
        addBackgroundColumn(backgroundObjects, x, variant, includeLight);
    }

    return backgroundObjects;
}

/**
 * Adds one stacked background column with water, floor layers, and optional light.
 * @param {BackgroundObject[]} backgroundObjects Target array for background objects.
 * @param {number} x X-position of the column.
 * @param {number} variant Texture variant number (1 or 2).
 * @param {boolean} includeLight Whether the light layer should be added.
 */
function addBackgroundColumn(backgroundObjects, x, variant, includeLight) {
    backgroundObjects.push(new BackgroundObject(`assets/img/background/water/${variant}.png`, x));
    backgroundObjects.push(new BackgroundObject(`assets/img/background/floor-3/${variant}.png`, x));
    backgroundObjects.push(new BackgroundObject(`assets/img/background/floor-2/${variant}.png`, x));
    backgroundObjects.push(new BackgroundObject(`assets/img/background/floor-1/${variant}.png`, x));

    if (includeLight) {
        backgroundObjects.push(
            new BackgroundObject(`assets/img/background/light/${variant}.png`, x),
        );
    }
}
