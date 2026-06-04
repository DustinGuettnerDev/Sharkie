class Puffer extends MovableOBject {
    height = 100;
    width = 100;
    x = 380 * Math.random() + 250;
    y = 400 * Math.random();
    swimNotReady = ["img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png", "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png", "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png", "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png"];

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor() {
        super();
        this.loadImage("img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png");
        this.move();
    }

    async move() {
        setInterval(() => {
            this.x -= 1;
        }, 1000 / 60); // für 60 Hz 1000 / 60 = 60 mal die sekunde
    }
}
