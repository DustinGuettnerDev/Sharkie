class World {
    character = new Character();
    enemies = [new Puffer(), new Puffer(), new Puffer()];
    ctx;
    canvas;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // 2d zeichenkontext wird in ctx gespeichert
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Inhalt des canvas wird damit gelöscht

        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);

        for (let puffer of this.enemies) {
            this.ctx.drawImage(puffer.img, puffer.x, puffer.y, puffer.width, puffer.height);
        }
        // draw() wird immer wieder aufgerufen

        requestAnimationFrame(() => {
            // function = eigenes this (sonst müsste man außen = let self = this, drinne = self.draw), => = übernimmt this aus dem äußeren Scope
            // plant den naechsten draw()-Aufruf fuer den naechsten Render-Zyklus; bei zu geringer Leistung sinkt die FPS
            this.draw();
        });
    }
}
