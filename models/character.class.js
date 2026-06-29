class Character extends MortalObject {
    height = 380;
    width = 280;
    x = 0;
    y = 100;
    imagesSwimming = [
        "img/1.Sharkie/3.Swim/1.png",
        "img/1.Sharkie/3.Swim/2.png",
        "img/1.Sharkie/3.Swim/1.png",
        "img/1.Sharkie/3.Swim/3.png",
        "img/1.Sharkie/3.Swim/4.png",
        "img/1.Sharkie/3.Swim/5.png",
        "img/1.Sharkie/3.Swim/6.png",
    ];
    world;

    imagesHurtShock = [
        "img/1.Sharkie/5.Hurt/2.Electric shock/1.png",
        "img/1.Sharkie/5.Hurt/2.Electric shock/2.png",
    ];

    imagesHurtPoison = [
        "img/1.Sharkie/5.Hurt/1.Poisoned/1.png",
        "img/1.Sharkie/5.Hurt/1.Poisoned/2.png",
        "img/1.Sharkie/5.Hurt/1.Poisoned/3.png",
        "img/1.Sharkie/5.Hurt/1.Poisoned/4.png",
    ];

    imagesPoisonDeath = [
        "img/1.Sharkie/6.dead/1.Poisoned/1.png",
        "img/1.Sharkie/6.dead/1.Poisoned/2.png",
        "img/1.Sharkie/6.dead/1.Poisoned/3.png",
        "img/1.Sharkie/6.dead/1.Poisoned/4.png",
        "img/1.Sharkie/6.dead/1.Poisoned/5.png",
        "img/1.Sharkie/6.dead/1.Poisoned/6.png",
        "img/1.Sharkie/6.dead/1.Poisoned/7.png",
        "img/1.Sharkie/6.dead/1.Poisoned/8.png",
        "img/1.Sharkie/6.dead/1.Poisoned/9.png",
        "img/1.Sharkie/6.dead/1.Poisoned/10.png",
        "img/1.Sharkie/6.dead/1.Poisoned/11.png",
        "img/1.Sharkie/6.dead/1.Poisoned/12.png",
    ];

    imagesShockDeath = [
        "img/1.Sharkie/6.dead/2.Electro_shock/1.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/2.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/3.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/4.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/5.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/6.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/7.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/8.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/9.png",
        "img/1.Sharkie/6.dead/2.Electro_shock/10.png",
    ];

    imagesWait = [
        "img/1.Sharkie/1.IDLE/1.png",
        "img/1.Sharkie/1.IDLE/2.png",
        "img/1.Sharkie/1.IDLE/3.png",
        "img/1.Sharkie/1.IDLE/4.png",
        "img/1.Sharkie/1.IDLE/5.png",
        "img/1.Sharkie/1.IDLE/6.png",
        "img/1.Sharkie/1.IDLE/7.png",
        "img/1.Sharkie/1.IDLE/8.png",
        "img/1.Sharkie/1.IDLE/9.png",
        "img/1.Sharkie/1.IDLE/10.png",
        "img/1.Sharkie/1.IDLE/11.png",
        "img/1.Sharkie/1.IDLE/12.png",
        "img/1.Sharkie/1.IDLE/13.png",
        "img/1.Sharkie/1.IDLE/14.png",
        "img/1.Sharkie/1.IDLE/15.png",
        "img/1.Sharkie/1.IDLE/16.png",
        "img/1.Sharkie/1.IDLE/17.png",
        "img/1.Sharkie/1.IDLE/18.png",
    ];

    imagesSleep = [
        "img/1.Sharkie/2.Long_IDLE/i1.png",
        "img/1.Sharkie/2.Long_IDLE/i2.png",
        "img/1.Sharkie/2.Long_IDLE/i3.png",
        "img/1.Sharkie/2.Long_IDLE/i4.png",
        "img/1.Sharkie/2.Long_IDLE/i5.png",
        "img/1.Sharkie/2.Long_IDLE/i6.png",
        "img/1.Sharkie/2.Long_IDLE/i7.png",
        "img/1.Sharkie/2.Long_IDLE/i8.png",
        "img/1.Sharkie/2.Long_IDLE/i9.png",
        "img/1.Sharkie/2.Long_IDLE/i10.png",
        "img/1.Sharkie/2.Long_IDLE/i11.png",
        "img/1.Sharkie/2.Long_IDLE/i12.png",
        "img/1.Sharkie/2.Long_IDLE/i13.png",
        "img/1.Sharkie/2.Long_IDLE/i14.png",
    ];

    imagesSlap = [
        "img/1.Sharkie/4.Attack/Fin slap/1.png",
        "img/1.Sharkie/4.Attack/Fin slap/2.png",
        "img/1.Sharkie/4.Attack/Fin slap/3.png",
        "img/1.Sharkie/4.Attack/Fin slap/4.png",
        "img/1.Sharkie/4.Attack/Fin slap/5.png",
        "img/1.Sharkie/4.Attack/Fin slap/6.png",
        "img/1.Sharkie/4.Attack/Fin slap/7.png",
        "img/1.Sharkie/4.Attack/Fin slap/8.png",
    ];

    imagesCreateBubble = [
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/1.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/2.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/3.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/4.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/5.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/6.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/7.png",
        "img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/8.png",
    ];

    imagesCreateBubblePoison = [
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png",
        "img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png",
    ];

    speed = 20;
    levelLimitUp = -150;
    levelLimitDown = 160;
    lifeCount = 2;
    coinCount = 0;
    poisonBottleCount = 0;
    animateInterval;
    inactiveStartTime = Date.now();
    waitTime = 5000;
    sleepTime = 15000;
    sleepAnimationFinished = false;
    enemyDamageType;
    lastHit = 0;
    slap = false;

    createBubble = {
        isActive: false,
        images: null,
    };

    collisionOffset = {
        top: 180,
        bottom: 100,
        left: 55,
        right: 55,
    };

    constructor(world = null) {
        super();
        this.world = world;
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImage("img/1.Sharkie/1.IDLE/1.png");
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesHurtPoison);
        this.loadImages(this.imagesHurtShock);
        this.loadImages(this.imagesPoisonDeath);
        this.loadImages(this.imagesShockDeath);
        this.loadImages(this.imagesSleep);
        this.loadImages(this.imagesWait);
        this.loadImages(this.imagesSlap);
        this.loadImages(this.imagesCreateBubble);
        this.loadImages(this.imagesCreateBubblePoison);
        this.moveCharacter();
        this.animate();
        /*         this.calculateCollisionOffset(); */
    }

    moveCharacter() {
        setInterval(() => {
            if (!this.hasZeroLife()) {
                if (this.world.keyboard.right && this.x !== this.world.level.levelEnd_x) {
                    this.moveRight();
                    this.otherDirection = false;
                } else if (this.world.keyboard.left && this.x > -1) {
                    this.moveLeft();
                    this.otherDirection = true;
                }

                if (this.world.keyboard.up && this.y >= this.levelLimitUp) {
                    this.moveUp();
                } else if (this.world.keyboard.down && this.y <= this.levelLimitDown) {
                    this.moveDown();
                }
                // bewegen der kamera anhand der zurückgelegten x-stecke der charackters
                this.moveCamera();
            }
        }, this.movementTickMs);
    }

    // hier anknüpfen
    animate() {
        this.animateInterval = setInterval(() => {
            if (this.checkDeath()) return;
            if (this.checkHurt()) return;
            if (this.checkSwimming()) return;
            if (this.checkSlap()) return;
            if (this.checkCreateBubble()) return;
            if (this.checkIdle()) return;
            this.defaultImageShark();
        }, this.animationTicksMs);
    }

    checkDeath() {
        if (this.hasZeroLife()) {
            this.playDeathTypeAnimation();
            return true;
        }
        return false;
    }

    checkHurt() {
        if (this.isHurt()) {
            this.playHurtTypeAnimation();
            this.startSleepCounter();
            return true;
        }
        return false;
    }

    checkSwimming() {
        if (
            this.world.keyboard.right ||
            this.world.keyboard.left ||
            this.world.keyboard.up ||
            this.world.keyboard.down
        ) {
            this.startSleepCounter();
            this.slap = false;
            this.createBubble.isActive = false;
            this.playAnimation(this.imagesSwimming);
            return true;
        }
        return false;
    }

    checkSlap() {
        if (this.world.keyboard.spacebar) {
            this.slap = true;
        }
        if (this.slap) {
            this.startSleepCounter();
            this.playSlapAnimation();
            return true;
        }
        return false;
    }

    playSlapAnimation() {
        let animationEnd = this.playAnimation(this.imagesSlap);
        if (animationEnd) {
            this.slap = false;
        }
    }

    checkCreateBubble() {
        if (this.world.keyboard.d) {
            this.createBubble.isActive = true;
        }
        if (this.createBubble.isActive) {
            this.startSleepCounter();
            this.playCreateBubbleAnimation();
            return true;
        }
        return false;
    }

    playCreateBubbleAnimation() {
        if (this.poisonBottleCount > 0) {
            this.createBubble.images = this.imagesCreateBubblePoison;
        } else {
            this.createBubble.images = this.imagesCreateBubble;
        }

        let animationEnd = this.playAnimation(this.createBubble.images);
        if (animationEnd) {
            this.createBubble.isActive = false;
            this.world.spawnBubble();
        }
    }

    checkIdle() {
        if (this.isInactive() >= this.sleepTime) {
            this.playSleepAnimation();
            return true;
        } else if (this.isInactive() >= this.waitTime) {
            this.playWaitAnimation();
            return true;
        }
        return false;
    }

    playDeathTypeAnimation() {
        let animationEnd = false;
        if (this.enemyDamageType === "poison") {
            animationEnd = this.playAnimation(this.imagesPoisonDeath);
            if (animationEnd) {
                this.riseUp({ yStepPx: 2, riseLimit: -80 });
            }
        } else if (this.enemyDamageType === "shock") {
            animationEnd = this.playAnimation(this.imagesShockDeath);
            if (animationEnd) {
                this.fallDown({ yStepPx: 2, fallLimit: 110 });
            }
        }
        if (animationEnd) {
            clearInterval(this.animateInterval);
        }
    }

    playHurtTypeAnimation() {
        if (this.enemyDamageType === "poison") {
            this.playAnimation(this.imagesHurtPoison);
        } else if (this.enemyDamageType === "shock") {
            this.playAnimation(this.imagesHurtShock);
        }
    }

    playWaitAnimation() {
        this.playAnimation(this.imagesWait);
    }

    playSleepAnimation() {
        if (this.sleepAnimationFinished) {
            this.lastFrame(this.imagesSleep);
            return;
        }

        let animationEnd = this.playAnimation(this.imagesSleep);
        if (animationEnd) {
            this.sleepAnimationFinished = true;
            this.lastFrame(this.imagesSleep);
        }
    }

    startSleepCounter() {
        this.inactiveStartTime = Date.now();
        this.sleepAnimationFinished = false;
    }

    isInactive() {
        return Date.now() - this.inactiveStartTime;
    }

    moveCamera() {
        this.world.camera_x = -this.x + 20;
    }

    getHit(enemy) {
        super.getHit();
        this.lastHit = Date.now();
        this.enemyDamageType = this.getEnemyDamageType(enemy);
    }

    getEnemyDamageType(enemy) {
        return enemy.damageType;
    }

    isHurt() {
        let timepassed = Date.now() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 5;
    }

    defaultImageShark() {
        this.loadImage("img/1.Sharkie/1.IDLE/1.png");
    }

    // shock mit anderen counter

    lastFrame(images) {
        return this.loadImage(images.at(-1));
    }
}
