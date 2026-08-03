/**
 * Base class for all visible game objects with image and position data.
 */
class DrawableObject {
    img = null;
    imageCache = {};
    x = 0;
    y = 0;
    width = 0;
    height = 0;

    /**
     * Loads a single image and assigns it to the current sprite image.
     * @param {string} path Image path to load.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images into the image cache for later use.
     * @param {string[]} arr Image paths to preload.
     */
    loadImages(arr) {
        for (let path of arr) {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }
    }
}
