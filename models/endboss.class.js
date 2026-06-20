class Endboss extends MovableObject {
    height = 600;
    width = 600;
    x = 1500;
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
    speed = 1;
    offset = {
        top: 285,
        bottom: 100,
        left: 40,
        right: 45,
    };
    life = 4;

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor() {
        super();
        this.loadImage(this.imagesSwimming[0]);
        this.loadImages(this.imagesSwimming);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.imagesSwimming);
        }, 200);
    }
}
