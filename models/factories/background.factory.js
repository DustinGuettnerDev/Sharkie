/**
 * Creates the full background setup for level 1.
 * @returns {BackgroundObject[]} Background object list.
 */
function createLevel1Background() {
    return createBackgroundObjects(addLevel1BackgroundColumn);
}

/**
 * Creates the full background layer setup for level 1.
 * @param {Function} backgroundColumns Callback that adds one background column for a given position.
 * @param {number} [startPosition=-720] First position in the background loop.
 * @param {number} [endPosition=9360] Last position in the background loop.
 * @param {number} [step=720] Distance between background positions.
 * @returns {BackgroundObject[]} Background object list.
 */
function createBackgroundObjects(
    backgroundColumns,
    startPosition = -720,
    endPosition = 9360,
    step = 720,
) {
    const backgroundObjects = [];

    for (let x = startPosition; x <= endPosition; x += step) {
        const variant = x % (step * 2) === 0 ? 1 : 2;
        const includeLight = x === 0 || x === step;
        backgroundColumns(backgroundObjects, x, variant, includeLight);
    }

    return backgroundObjects;
}

/**
 * Adds one stacked background column with water, floor layers, and optional light.
 * @param {BackgroundObject[]} backgroundObjects Target array for the background objects.
 * @param {number} x X-position of the column.
 * @param {number} variant Texture variant number (1 or 2).
 * @param {boolean} includeLight Whether the light layer should be added.
 */
function addLevel1BackgroundColumn(backgroundObjects, x, variant, includeLight) {
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
