class MovableObject extends CollidableObject {
    currentImage = 0;
    speed = 1;
    otherDirection = false;
    isHurt = false;

    playAnimation(imagesObject) {
        let i = this.currentImage % imagesObject.length;
        /*
            let i = 0 % 6; 0, Rest 0
            let i = 7 % 7; 1, Rest 0
            let i = 8 % 7; 1, Rest 1
            let i = 15 % 7; 2, Rest 1
            i = 0, 1, 2, 3, 4, 5, 6, 0 etc.
            Erklärung :
            14 / 7 = erster Wert
            15 - 14 = 1 = zweiter Wert
            Bei modulo wird der restwert nur ausgegeben
            */
        let path = imagesObject[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationAuto() {
        setInterval(() => {
            this.playAnimation(this.imagesSwimming);
        }, 200);
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
