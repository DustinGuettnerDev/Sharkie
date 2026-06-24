class RegularEnemy extends Enemy {
    movementInterval;
    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor(positionOffset = 900, speedOffset = 0.4) {
        super();
        this.positionOffset = positionOffset;
        this.speedOffset = speedOffset;
        this.x = 380 * Math.random() + this.positionOffset;
        this.y = 400 * Math.random();
        this.speed = this.speedOffset + Math.random() * 0.5; //jeder puffer hat somit eine unterschiedliche geschwindigkeit, da jeder puffer eine unterschiedliche instanz ist
    }

    // bewegung hier reinschreiben und die untermthoden in die jeweiligen klassen
    movement() {
        this.movementInterval = setInterval(() => {
            if (this.death) {
                this.handleDeathMovement();
            } else {
                this.handleAliveMovement();
            }
        }, this.movementTickMs); // gemeinsamer Bewegungstakt aus MovableObject
    }

    stopMovement() {
        clearInterval(this.movementInterval);
    }

    handleAliveMovement() {
        this.moveLeft();
    }

    pushRightTop({ xStepPx, yStepPx, rightLimit, riseLimit }) {
        this.pushRight({ xStepPx, rightLimit });
        this.riseUp({ yStepPx, riseLimit });
    }

    pushLeftTop({ xStepPx, yStepPx, leftLimit, riseLimit }) {
        this.pushLeft({ xStepPx, leftLimit });
        this.riseUp({ yStepPx, riseLimit });
    }
}
