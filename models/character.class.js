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
        "img/1.Sharkie/5.Hurt/2.Electric shock/.o1.png",
        "img/1.Sharkie/5.Hurt/2.Electric shock/.o2.png",
    ];

    imagesHurtPoison = [
        "img/1.Sharkie/5.Hurt/1.Poisoned/2.png",
        "img/1.Sharkie/5.Hurt/1.Poisoned/3.png",
        "img/1.Sharkie/5.Hurt/1.Poisoned/4.png",
        "img/1.Sharkie/5.Hurt/1.Poisoned/5.png",
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

    speed = 20;
    levelLimitUp = -150;
    levelLimitDown = 160;
    isHurt = false;
    life = 10;
    coins = 0;
    poison = 0;

    constructor() {
        super();
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImage("img/1.Sharkie/1.IDLE/1.png");
        this.loadImages(this.imagesSwimming);
        this.loadImages(this.imagesHurtPoison);
        this.loadImages(this.imagesHurtShock);
        this.loadImages(this.imagesPoisonDeath);
        this.loadImages(this.imagesShockDeath);
        this.animate();
        /*         this.calculateOffset(); */
    }

    animate() {
        setInterval(() => {
            this.moveCharacter();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDieAnimation(this.imagesPoisonDeath);
            } else if (this.isHurt) {
                this.playHurtAnimation(this.imagesHurtPoison);
                this.isHurt = false;
            } else {
                this.playSwimmingAnimation();
            }
        }, 200);
    }

    moveCamera() {
        this.world.camera_x = -this.x + 20;
    }

    playSwimmingAnimation() {
        if (
            this.world.keyboard.right ||
            this.world.keyboard.left ||
            this.world.keyboard.up ||
            this.world.keyboard.down
        ) {
            this.playAnimation(this.imagesSwimming);
        }
    }

    moveCharacter() {
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
}
