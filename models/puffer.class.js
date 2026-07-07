class Puffer extends RegularEnemy {
    height = 100;
    width = 100;
    animateInterval = null;
    imagesSwimming = [
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    ];

    imageDeath =
        "img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png";

    imagesAggroTransition = [
        "img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition1.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition4.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition5.png",
    ];

    imagesAggro = [
        "img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim1.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim4.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim5.png",
    ];

    collisionOffset = {
        top: 10,
        bottom: 10,
        left: 5,
        right: 10,
    };

    aggroOffset = {
        top: -100,
        bottom: -100,
        left: -100,
        right: -100,
    };

    lifeCount = 1;
    damageType = "poison";
    world = null;
    rangeAfterSlap = 300;
    deathKnockbackDirection = null;
    deathKnockbackStarted = false;
    weakness = ["slap"]; //implementieren
    transitionAggroEnded = false;
    aggro = false;
    speedSlap = 10;

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor(positionOffset = 0, speedOffset = 0) {
        super(positionOffset, speedOffset);
        this.loadImage(this.imagesSwimming[0]);
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesAggroTransition);
        this.loadImages(this.imagesAggro);
        this.animate();
        this.movement();
    }

    animate() {
        this.animateInterval = setInterval(() => {
            if (!this.world?.character) return;
            if (this.death) {
                this.loadImage(this.imageDeath);
                this.stopAnimationInterval();
                return;
            } else {
                if (this.isInAggroRange(this.world.character)) {
                    this.aggro = true;
                }
                if (this.aggro) {
                    if (this.transitionAggroEnded) {
                        this.playAnimation(this.imagesAggro);
                        return;
                    }
                    this.transitionAggroEnded = this.playAnimation(this.imagesAggroTransition);
                    return;
                }
                this.playAnimation(this.imagesSwimming);
                this.transitionAggroEnded = false;
            }
        }, this.animationTicksMs);
    }

    handleDeathMovement() {
        if (!this.world?.character) return;
        if (!this.deathKnockbackStarted) {
            this.deathKnockbackDirection = this.world.character.x < this.x ? "left" : "right";
            this.deathKnockbackStarted = true;
        }

        if (this.y > -500) {
            if (this.deathKnockbackDirection === "left") {
                this.moveLeft(this.speedSlap);
                this.moveUp(this.speedSlap);
            } else {
                this.moveRight(this.speedSlap);
                this.moveUp(this.speedSlap);
            }
        }
    }

    isInAggroRange(character) {
        return (
            this.x + this.width - this.aggroOffset.right >
                character.x + character.collisionOffset.left &&
            this.y + this.height - this.aggroOffset.bottom >
                character.y + character.collisionOffset.top &&
            this.x + this.aggroOffset.left <
                character.x + character.width - character.collisionOffset.right &&
            this.y + this.aggroOffset.top <
                character.y + character.height - character.collisionOffset.bottom
        );
    }
}
