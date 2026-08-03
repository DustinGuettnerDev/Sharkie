/**
 * Base class for movable objects such as the player, enemies, and projectiles.
 * It handles movement, animations, and collision detection.
 */
class MovableObject extends DrawableObject {
    currentImage = 0;
    lastAnimation = null;
    speed = 1;
    otherDirection = false;
    movementTickMs = 1000 / 60;
    animationTicksMs = 140;
    collisionOffset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    /**
     * Moves the object to the right by increasing its x position.
     * @param {number} speed Distance per step.
     */
    moveRight(speed = this.speed) {
        this.x += speed;
    }

    /**
     * Moves the object to the left by decreasing its x position.
     * @param {number} speed Distance per step.
     */
    moveLeft(speed = this.speed) {
        this.x -= speed;
    }

    /**
     * Moves the object upward by decreasing its y position.
     * @param {number} speed Distance per step.
     */
    moveUp(speed = this.speed) {
        this.y -= speed;
    }

    /**
     * Moves the object downward by increasing its y position.
     * @param {number} speed Distance per step.
     */
    moveDown(speed = this.speed) {
        this.y += speed;
    }

    /**
     * Plays an animation by cycling through the provided image frames.
     * @param {string[]} imagesObject List of image paths for the animation.
     * @returns {boolean} True if the animation has looped back to the start, otherwise false.
     */
    playAnimation(imagesObject) {
        if (imagesObject !== this.lastAnimation) {
            this.currentImage = 0;
            this.lastAnimation = imagesObject;
        }

        let path = imagesObject[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (this.currentImage >= imagesObject.length) {
            this.currentImage = 0;
            return true;
        }
    }

    /**
     * Checks whether the object collides with another object.
     * @param {DrawableObject} drawObject The other object.
     * @returns {boolean} True on collision, otherwise false.
     */
    isColliding(drawObject) {
        return (
            this.x + this.width - this.collisionOffset.right >
                drawObject.x + drawObject.collisionOffset.left &&
            this.y + this.height - this.collisionOffset.bottom >
                drawObject.y + drawObject.collisionOffset.top &&
            this.x + this.collisionOffset.left <
                drawObject.x + drawObject.width - drawObject.collisionOffset.right &&
            this.y + this.collisionOffset.top <
                drawObject.y + drawObject.height - drawObject.collisionOffset.bottom
        );
    }

    /**
     * Stops the movement loop if it is currently running.
     */
    stopMovementInterval() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
    }

    /**
     * Stops the animation loop if it is currently running.
     */
    stopAnimationInterval() {
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
    }
}
