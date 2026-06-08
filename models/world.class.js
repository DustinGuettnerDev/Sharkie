class World {
    character = new Character();
    enemies = [new Puffer(), new Puffer(), new Puffer()];
    backgroundObjects = [
        new BackgroundObject("img/3. Background/Layers/5. Water/D1.png"),
        new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D1.png"),
        new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D1.png"),
        new BackgroundObject("img/3. Background/Layers/2. Floor/D1.png"),
        new BackgroundObject("img/3. Background/Layers/1. Light/1.png"),
    ];
    ctx;
    canvas;
    keyboard;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // 2d zeichenkontext wird in ctx gespeichert
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
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

    setWorld() {
        this.character.world = this;
    }

    addObjectsToMap(objects) {
        for (let object of objects) {
            this.addToMap(object);
        }
    }

    addToMap(object) {
        if (object.otherDirection) {
            this.ctx.save();
            // Zeichenzustand sichern, damit die Spiegelung nur fuer dieses Objekt gilt.
            this.ctx.translate(object.width, 0);
            /* Ursprung nach rechts verschieben, damit das gespiegelte Bild an der richtigen Stelle bleibt.
               |<- img x|x  img ->  | Die X Position bleibt beim spiegeln des Bildes auf derselben stellen. Nur wird
               das Bild somit verschoben. Das ändert man indem man beim links steuern der X-Achse ein offset von der Breite
               des Bildes gibt */
            this.ctx.scale(-1, 1);
            // X-Achse spiegeln, Y-Achse unveraendert lassen.
            object.x *= -1;
            // Weltkoordinate kurz negativ setzen, damit die Figur nach dem Spiegeln nicht springt.
            // | abstand | img | -> |  img  |  abstand  | das wird damit negiert.
        }

        // Objekt mit seiner Position und Groesse zeichnen.
        this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);

        if (object.otherDirection) {
            // Ursprung wieder zuruecksetzen und die originale x-Position wiederherstellen.
            object.x *= -1;
            this.ctx.restore();

            //
            /* save und restore setzen einfach wieder das urpsprüngliche zurück: 
            this.ctx.scale(-1, 1);
            this.ctx.translate(-object.width, 0); */
        }
    }
}
