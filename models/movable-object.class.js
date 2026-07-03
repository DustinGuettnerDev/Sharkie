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

    moveRight(speed = this.speed) {
        this.x += speed;
    }

    moveLeft(speed = this.speed) {
        this.x -= speed;
    }

    moveUp(speed = this.speed) {
        this.y -= speed;
    }

    moveDown(speed = this.speed) {
        this.y += speed;
    }

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
