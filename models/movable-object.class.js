/**
 * Represents a movable object in the game, extending the DrawableObject class. A movable object can move in different directions, play animations, and detect collisions with other drawable objects.
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
     * Plays an animation by cycling through the provided array of image paths.
     * @param {string[]} imagesObject An array of image paths for the animation.
     * @returns {boolean} True if the animation has looped back to the start, false otherwise.
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
     * Moves the object to the right by increasing its x position by speed.
     * @param {number} speed Distance added to x each call.
     */
    moveRight(speed = this.speed) {
        this.x += speed;
    }

    /**
     * Moves the object to the left by decreasing its x position by speed.
     * @param {number} speed Distance subtracted from x each call.
     */
    moveLeft(speed = this.speed) {
        this.x -= speed;
    }

    /**
     * Moves the object up by decreasing its y position by speed.
     * @param {number} speed Distance subtracted from y each call.
     */
    moveUp(speed = this.speed) {
        this.y -= speed;
    }

    /**
     * Moves the object down by increasing its y position by speed.
     * @param {number} speed Distance added to y each call.
     */
    moveDown(speed = this.speed) {
        this.y += speed;
    }

    /**
     * Stops the movement interval if it is currently active.
     */
    stopMovementInterval() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
    }

    /**
     * Stops the animation interval if it is currently active.
     */
    stopAnimationInterval() {
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
    }

    /**
     * Checks if the current object is colliding with another movable object.
     * @param {DrawableObject} drawObject
     * @returns {boolean} True if the object is colliding with drawObject, false otherwise.
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
}
