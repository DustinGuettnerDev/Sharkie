class Character extends MovableOBject {
    constructor() {
        super();
        /*super() ruft den Konstruktor der Elternklasse auf;
        in einer abgeleiteten Klasse muss das vor this passieren.*/
        this.loadImg("img/1.Sharkie/1.IDLE/1.png");
        this.height = 300;
        this.width = 200;
        this.x = 20;
        this.y = 200;
    }
}
