class Character extends MovableObject {
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
    speed = 20;
    energy = 100;
    levelLimitUp = -150;
    levelLimitDown = 160;

    constructor() {
        super();
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImage("img/1.Sharkie/1.IDLE/1.png");
        this.loadImages(this.imagesSwimming);
        this.animate();
        /*         this.calculateOffset(); */
    }

    animate() {
        setInterval(() => {
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
        }, 1000 / 60);

        setInterval(() => {
            if (
                this.world.keyboard.right ||
                this.world.keyboard.left ||
                this.world.keyboard.up ||
                this.world.keyboard.down
            ) {
                this.playAnimation(this.imagesSwimming);
            }
        }, 200);
    }

    moveCamera() {
        this.world.camera_x = -this.x + 20;
    }
}
