class Puffer extends MortalObject {
    height = 100;
    width = 100;
    x = 380 * Math.random() + 250;
    y = 400 * Math.random();
    imagesSwimming = [
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
        "img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    ];
    speed = 0.4 + Math.random() * 0.5; //jeder puffer hat somit eine unterschiedliche geschwindigkeit, da jeder puffer eine unterschiedliche instanz ist
    offset = {
        top: 10,
        bottom: 30,
        left: 5,
        right: 10,
    };
    life = 1;

    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor() {
        super();
        this.loadImage(this.imagesSwimming[0]);
        this.loadImages(this.imagesSwimming);
        this.animate();
    }

    animate() {
        this.playAnimationAuto();
        this.moveLeftAuto();
    }
}
