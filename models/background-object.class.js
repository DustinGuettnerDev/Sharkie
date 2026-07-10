/**
 * Represents a background object in the game, extending the DrawableObject class.
 */
class BackgroundObject extends DrawableObject {
    x;
    y = 0;
    width = 720;
    height = 480;

    constructor(imagePath, x = 0) {
        super();
        if (!imagePath) {
            throw new Error("BackgroundObject initialization failed: imagePath is required.");
        }
        this.loadImage(imagePath);
        this.x = x;
    }
}
