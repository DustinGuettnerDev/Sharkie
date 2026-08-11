/**
 * Represents a coin in the game, which can be collected by the character.
 */
class Coin extends DrawableObject {
    height = 45;
    width = 45;
    collisionOffset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    /**
     * Creates a coin at the specified position.
     * @param {number} x X-coordinate.
     * @param {number} y Y-coordinate.
     */
    constructor(x = 0, y = 0) {
        super();
        this.loadImage(IMG_PATHS.coin);
        this.x = x;
        this.y = y;
    }
}
