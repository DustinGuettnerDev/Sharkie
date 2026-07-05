class Endboss extends Enemy {
    height = 600;
    width = 600;
    animateInterval;
    movementInterval;
    x = 3400;
    y = -100;
    imagesSwimming = [
        "img/2.Enemy/3 Final Enemy/2.floating/1.png",
        "img/2.Enemy/3 Final Enemy/2.floating/2.png",
        "img/2.Enemy/3 Final Enemy/2.floating/3.png",
        "img/2.Enemy/3 Final Enemy/2.floating/4.png",
        "img/2.Enemy/3 Final Enemy/2.floating/5.png",
        "img/2.Enemy/3 Final Enemy/2.floating/6.png",
        "img/2.Enemy/3 Final Enemy/2.floating/7.png",
        "img/2.Enemy/3 Final Enemy/2.floating/8.png",
        "img/2.Enemy/3 Final Enemy/2.floating/9.png",
        "img/2.Enemy/3 Final Enemy/2.floating/10.png",
        "img/2.Enemy/3 Final Enemy/2.floating/11.png",
        "img/2.Enemy/3 Final Enemy/2.floating/12.png",
        "img/2.Enemy/3 Final Enemy/2.floating/13.png",
    ];

    imagesAppear = [
        "img/2.Enemy/3 Final Enemy/1.Introduce/1.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/2.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/3.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/4.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/5.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/6.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/7.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/8.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/9.png",
        "img/2.Enemy/3 Final Enemy/1.Introduce/10.png",
    ];

    imagesAttack = [
        "img/2.Enemy/3 Final Enemy/Attack/1.png",
        "img/2.Enemy/3 Final Enemy/Attack/2.png",
        "img/2.Enemy/3 Final Enemy/Attack/3.png",
        "img/2.Enemy/3 Final Enemy/Attack/4.png",
        "img/2.Enemy/3 Final Enemy/Attack/5.png",
        "img/2.Enemy/3 Final Enemy/Attack/6.png",
    ];

    imagesHurt = [
        "img/2.Enemy/3 Final Enemy/Hurt/1.png",
        "img/2.Enemy/3 Final Enemy/Hurt/2.png",
        "img/2.Enemy/3 Final Enemy/Hurt/3.png",
        "img/2.Enemy/3 Final Enemy/Hurt/4.png",
    ];

    imagesDeath = [
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
        "img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png",
    ];

    speed = 1;
    collisionOffset = {
        top: 285,
        bottom: 100,
        left: 40,
        right: 45,
    };
    lifeCount = 5;
    damageType = "shock";
    weakness = ["poison-bubble"];
    deathAnimationEnd = false;
    attackAnimationEnd = false;
    hurtTime = 1;
    world;
    appearingPositionTrigger = 3000;
    appearAnimationStarted = false;
    appearAnimationEnd = false;
    startTime;
    timeTillAttack = 1;
    attackMove;
    speed = 5;
    offsetYPositionToCharacter = 160;
    offsetRightPositionToCharacter = -80;
    offsetLeftPostionToCharacter = 400;

    constructor() {
        super();
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesAttack);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDeath);
        this.loadImages(this.imagesAppear);
        this.animate();
        this.movement();
        /* this.positionIntervall(); */
    }
    // fehler appearing funktioniert noch nicht richtig
    animate() {
        this.animateInterval = setInterval(() => {
            if (!this.appearAnimationEnd) {
                if (this.isAppearing() || this.appearAnimationStarted) {
                    this.appearAnimationEnd = this.playAnimation(this.imagesAppear);
                    this.appearAnimationStarted = !this.appearAnimationEnd;
                    if (this.appearAnimationEnd) {
                        this.startTime = Date.now();
                    }
                }
            } else {
                if (this.death) {
                    this.playDeathAnimation(this.imagesDeath);
                } else if (this.isHurt()) {
                    this.playAnimation(this.imagesHurt);
                } else if (this.attackTimer()) {
                    this.attackAnimationEnd = this.playAnimation(this.imagesAttack);
                    this.attackMove = true;
                    if (this.attackAnimationEnd) {
                        this.startTime = Date.now();
                        this.attackMove = false;
                    }
                } else {
                    this.playAnimation(this.imagesSwimming);
                }
            }
        }, this.animationTicksMs);
    }

    playDeathAnimation() {
        if (this.deathAnimationEnd) return;
        this.deathAnimationEnd = this.playAnimation(this.imagesDeath);
        if (this.deathAnimationEnd) {
            clearInterval(this.animateInterval);
        }
    }

    movement() {
        this.movementInterval = setInterval(() => {
            if (this.death && this.y > -500) {
                this.moveUp(1);
            } else if (this.death) {
                clearInterval(this.movementInterval);
            } else if (this.attackMove) {
                if (this.isAboveCharacter()) {
                    this.moveDown();
                } else if (this.isBelowCharacter()) {
                    this.moveUp();
                }
                if (this.isRightFromCharacter()) {
                    this.otherDirection = false;
                    this.moveLeft();
                } else if (this.isLeftFromCharacter()) {
                    this.otherDirection = true;
                    this.moveRight();
                }
            }
        }, this.movementTickMs);
    }

    getHit() {
        super.getHit();
        this.lastHit = Date.now();
    }

    isAppearing() {
        return this.world.character.x >= this.appearingPositionTrigger;
    }

    attackTimer() {
        let timepassed = (Date.now() - this.startTime) / 1000;
        return timepassed > this.timeTillAttack;
    }

    isBelowCharacter() {
        return this.world.character.y < this.y + this.offsetYPositionToCharacter;
    }

    isAboveCharacter() {
        return this.world.character.y > this.y + this.offsetYPositionToCharacter;
    }

    isRightFromCharacter() {
        return this.world.character.x < this.x + this.offsetRightPositionToCharacter;
    }

    isLeftFromCharacter() {
        return this.world.character.x > this.x + this.offsetLeftPostionToCharacter;
    }

    /* positionIntervall() {
        setInterval(() => {
            console.log(`endboss ${this.x}`);
            console.log(`character ${this.world.character.x}`);
        }, 1000);
    } */
}
