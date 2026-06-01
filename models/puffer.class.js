class Puffer extends MovableOBject {
    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor() {
        super();
        this.loadImg("img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png");
        this.height = 100;
        this.width = 100;
        this.x = 380 * Math.random() + 250;
        this.y = 400 * Math.random();
    }
}
