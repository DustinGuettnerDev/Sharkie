class Puffer extends MovableObject {
    height = 100;
    width = 100;
    x = 380 * Math.random() + 250;
    y = 400 * Math.random();
    imagesSwimming = [
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    ];
    speed = 0.4 + Math.random() * 0.5; //jeder puffer hat somit eine unterschiedliche geschwindigkeit, da jeder puffer eine unterschiedliche instanz ist

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor() {
        super();
        this.loadImage("img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png");
        this.loadImages(this.imagesSwimming);
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.imagesSwimming.length;
            // i = 0, 1, 2, 3, 4, 5, 6, 0 etc.
            let path = this.imagesSwimming[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 300);
        this.moveLeft();
    }
}
