class World {
    character = new Character();
    enemies = [new Puffer(), new Puffer(), new Puffer()];
    ctx;
    canvas;
    control = new Control();
    backgroundObjects = [new BackgroundObject("img/3. Background/Layers/5. Water/D1.png"), new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D1.png"), new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D1.png"), new BackgroundObject("img/3. Background/Layers/2. Floor/D1.png"), new BackgroundObject("img/3. Background/Layers/1. Light/1.png")];

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // 2d zeichenkontext wird in ctx gespeichert
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Inhalt des canvas wird damit gelöscht

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);

        // draw() wird immer wieder aufgerufen

        requestAnimationFrame(() => {
            // function = eigenes this (sonst müsste man außen = let self = this, drinne = self.draw), => = übernimmt this aus dem äußeren Scope
            // plant den naechsten draw()-Aufruf fuer den naechsten Render-Zyklus; bei zu geringer Leistung sinkt die FPS
            this.draw();
        });
    }

    addObjectsToMap(objects) {
        for (let object of objects) {
            this.addToMap(object);
        }
    }

    addToMap(object) {
        this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
    }
}
