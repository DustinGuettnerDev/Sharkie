class Coin extends CollidableObject {
    imageCoins = "img/4. Marcadores/1. Coins/1.png";
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

    constructor(x, y) {
        super();
        this.loadImage(this.imageCoins);
        this.x = x;
        this.y = y;
    }
}
