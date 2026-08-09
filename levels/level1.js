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

const enemieSpecies = [Puffer, JellyFish];
const enemieNumber = 30;
let enemieArray = [];

const levelStartSpawnRegularEnemies = 500;
const levelEndingRegularEnemies = 9000;
const positionPerEnemy = levelEndingRegularEnemies / enemieNumber;

let positionOffset = levelStartSpawnRegularEnemies;

/**
 * Creates a random set of regular enemies with randomized spawn positions.
 * @returns {(Puffer|JellyFish)[]} The generated enemy list.
 */
function createLevel1Enemies() {
    for (let i = 0; i < enemieNumber; i++) {
        const randomBit = Math.round(Math.random());
        const SpeciesClass = enemieSpecies[randomBit];

        enemieArray.push(new SpeciesClass(positionOffset));
        positionOffset += positionPerEnemy;
    }

    return enemieArray;
}

function createLevel1Endboss() {
    const endboss = new Endboss();
    endboss.x = 7400;
    endboss.appearingPositionTrigger = 6800;
    return endboss;
}

/**
 * Creates the current collectible pattern setup for level 1 (WIP).
 * @returns {Coin[]} Collectible coin list.
 */
function createLevel1Collectibles() {
    return createCoinCurve(100, 400, 80, 40);
}

/**
 * Creates a symmetric curve with 6 coins.
 * @param {number} coinXPosition X-position of the first coin.
 * @param {number} coinYPosition Y-position of the first coin.
 * @param {number} xGapOffset Additional horizontal spread factor.
 * @param {number} yGapOffset Additional vertical spread factor.
 * @param {boolean} isUpsideDown Whether the curve should be flipped vertically.
 * @returns {Coin[]} Curve coin pattern.
 */
function createCoinCurve(
    coinXPosition,
    coinYPosition,
    xGapOffset = 20,
    yGapOffset = 20,
    isUpsideDown = false,
) {
    const coinArray = [];
    const yMultipliers = [0, -2, -3, -3, -2, 0];
    const direction = isUpsideDown ? -1 : 1;

    for (let index = 0; index < yMultipliers.length; index++) {
        const xPosition = coinXPosition + index * xGapOffset;
        const yPosition = coinYPosition + yMultipliers[index] * yGapOffset * direction;
        coinArray.push(new Coin(xPosition, yPosition));
    }

    return coinArray;
}

/**
 * Creates a 7-coin pyramid pattern.
 * @param {number} coinXPosition X-position of the first coin.
 * @param {number} coinYPosition Y-position of the first coin.
 * @param {number} xGapOffset Additional horizontal spread factor.
 * @param {number} yGapOffset Additional vertical spread factor.
 * @param {boolean} isUpsideDown Whether the pyramid should be flipped vertically.
 * @returns {Coin[]} Pyramid coin pattern.
 */
function createCoinPyramid(
    coinXPosition,
    coinYPosition,
    xGapOffset = 20,
    yGapOffset = 20,
    isUpsideDown = false,
) {
    const coinArray = [];
    const yMultipliers = [0, -1, -2, -3, -2, -1, 0];
    const direction = isUpsideDown ? -1 : 1;

    for (let index = 0; index < yMultipliers.length; index++) {
        const xPosition = coinXPosition + index * xGapOffset;
        const yPosition = coinYPosition + yMultipliers[index] * yGapOffset * direction;
        coinArray.push(new Coin(xPosition, yPosition));
    }

    return coinArray;
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
