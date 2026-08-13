/**
 * Creates the full collectible setup for level 1 from predefined patterns and extra random coins.
 * @returns {(Coin|PoisonBottle)[]} All collectible objects for the level.
 */
function createLevel1Collectibles() {
    return [...createLevel1Coins(), ...createLevel1PoisonBottles()];
}

function createLevel1Coins() {
    return [...createCoinCurve(1000, 400, 160, 60), ...createCoinPyramid(2500, 0, 120, 60, true), ...createCoinCurve(4000, 50, 120, 60, true), ...createCoinPyramid(5500, 400, 100, 60), ...createRandomCoinAmount(10)];
}

/**
 * Creates the poison bottle collectibles for level 1 at fixed floor-aligned positions.
 * @returns {PoisonBottle[]} Poison bottle list.
 */
function createLevel1PoisonBottles() {
    return [new PoisonBottle(1400, 400, true), new PoisonBottle(3500, 400, false), new PoisonBottle(5780, 390, true), new PoisonBottle(7800, 390, false)];
}

/**
 * Creates a random cluster of additional coins within the provided range.
 * @param {number} maxAmount Maximum number of coins to create.
 * @returns {Coin[]} Random coin list.
 */
function createRandomCoinAmount(maxAmount) {
    const randomAmount = Math.floor(Math.random() * maxAmount);
    const coins = [];

    for (let index = 0; index < randomAmount; index++) {
        coins.push(createRandomCoin(1000, 6000, 0, 400));
    }

    return coins;
}

/**
 * Creates a single coin at a random position within the provided range.
 * @param {number} startRangeXPosition Minimum x position.
 * @param {number} endRangeXPosition Maximum x position.
 * @param {number} startRangeYPosition Minimum y position.
 * @param {number} endRangeYPosition Maximum y position.
 * @returns {Coin} Randomly positioned coin.
 */
function createRandomCoin(startRangeXPosition, endRangeXPosition, startRangeYPosition, endRangeYPosition) {
    const differenceX = endRangeXPosition - startRangeXPosition;
    const differenceY = endRangeYPosition - startRangeYPosition;

    const randomXPosition = Math.random() * differenceX + startRangeXPosition;
    const randomYPosition = Math.random() * differenceY + startRangeYPosition;

    return new Coin(randomXPosition, randomYPosition);
}

/**
 * Creates a symmetric coin curve with 6 coins.
 * @param {number} coinXPosition X-position of the first coin.
 * @param {number} coinYPosition Y-position of the first coin.
 * @param {number} xGapOffset Horizontal spread factor.
 * @param {number} yGapOffset Vertical spread factor.
 * @param {boolean} isUpsideDown Whether the curve should be flipped vertically.
 * @returns {Coin[]} Curve coin pattern.
 */
function createCoinCurve(coinXPosition, coinYPosition, xGapOffset = 20, yGapOffset = 20, isUpsideDown = false) {
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
 * @param {number} xGapOffset Horizontal spread factor.
 * @param {number} yGapOffset Vertical spread factor.
 * @param {boolean} isUpsideDown Whether the pyramid should be flipped vertically.
 * @returns {Coin[]} Pyramid coin pattern.
 */
function createCoinPyramid(coinXPosition, coinYPosition, xGapOffset = 20, yGapOffset = 20, isUpsideDown = false) {
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
