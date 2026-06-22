class MovableObject extends CollidableObject {
    currentImage = 0;
    lastAnimation = null;
    speed = 1;
    otherDirection = false;
    frameTime = 100;

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

    playAnimationAuto() {
        setInterval(() => {
            this.playAnimation(this.imagesSwimming);
        }, this.frameTime);
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

    moveLeftAuto() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60); // für 60 Hz 1000 / 60 = 60 mal die sekunde
    }
}
