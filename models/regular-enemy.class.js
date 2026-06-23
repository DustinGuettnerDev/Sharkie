class RegularEnemy extends Enemy {
    // man muss hier die eigenschaften nicht nochmal deklarieren, da sie schon im parent deklariert wurden
    constructor(positionOffset = 900, speedOffset = 0.4) {
        super();
        this.positionOffset = positionOffset;
        this.speedOffset = speedOffset;
        this.x = 380 * Math.random() + this.positionOffset;
        this.y = 400 * Math.random();
        this.speed = this.speedOffset + Math.random() * 0.5; //jeder puffer hat somit eine unterschiedliche geschwindigkeit, da jeder puffer eine unterschiedliche instanz ist
    }
}
