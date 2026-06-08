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
    speed = 2;

    constructor() {
        super();
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImage("img/1.Sharkie/1.IDLE/1.png");
        this.loadImages(this.imagesSwimming);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.right) {
                this.x += this.speed;
                this.otherDirection = false;
            } else if (this.world.keyboard.left) {
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if (this.world.keyboard.up) {
                this.y -= this.speed;
            } else if (this.world.keyboard.down) {
                this.y += this.speed;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.right || this.world.keyboard.left || this.world.keyboard.up || this.world.keyboard.down) {
                let i = this.currentImage % this.imagesSwimming.length;
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
                let path = this.imagesSwimming[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 50);
    }
}
