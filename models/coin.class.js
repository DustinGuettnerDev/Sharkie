/**
 * Represents a coin in the game, which can be collected by the character.
 */
class Coin extends DrawableObject {
    imageCoins = IMG_PATHS.coin.normal;
    height = 45;
    width = 45;
    x;
    y;
    collisionOffset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
    };

    constructor(x = 0, y = 0) {
        super();
        this.loadImage(this.imageCoins);
        this.x = x;
        this.y = y;
    }
}
