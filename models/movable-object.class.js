class MovableObject extends CollidableObject {
    currentImage = 0;
    lastAnimation = null;
    speed = 1;
    otherDirection = false;
    movementTickMs = 1000 / 60;
    animationTicksMs = 140;

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

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }

    riseUp({ yStepPx, riseLimit }) {
        let yRiseInterval = setInterval(() => {
            if (this.y > riseLimit) {
                this.y -= yStepPx;
            } else {
                clearInterval(yRiseInterval);
            }
        }, this.movementTickMs);
    }

    fallDown({ yStepPx, fallLimit }) {
        let yFallInterval = setInterval(() => {
            if (this.y < fallLimit) {
                this.y += yStepPx;
            } else {
                clearInterval(yFallInterval);
            }
        }, this.movementTickMs);
    }

    pushLeft({ xStepPx, leftLimit }) {
        let xLeftInterval = setInterval(() => {
            if (this.x > leftLimit) {
                this.x -= xStepPx;
            } else {
                clearInterval(xLeftInterval);
            }
        }, this.movementTickMs);
    }

    pushRight({ xStepPx, rightLimit }) {
        let xRightInterval = setInterval(() => {
            if (this.x < rightLimit) {
                this.x += xStepPx;
            } else {
                clearInterval(xRightInterval);
            }
        }, this.movementTickMs);
    }
}
