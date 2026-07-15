/**
 * Creates and returns the first level of the game.
 * @returns {Level} The first level of the game.
 */
function createLevel_1() {
    return new Level(
        [
            new Puffer(150, 0.5),
            new JellyFish(550, 0.7),
            new Puffer(950, 1),
            new Puffer(1350, 0.6),
            new JellyFish(1550, 1.4),
            new Puffer(2100, 0.8),
            new JellyFish(2400, 0.9),
            new Puffer(2700, 1.8),
            new Puffer(2900, 1.3),
            new JellyFish(3000, 0.9),
        ],

        new Endboss(),

        [
            new Coin(420, 400),
            new Coin(490, 330),
            new Coin(600, 300),
            new Coin(700, 300),
            new Coin(790, 330),
            new Coin(860, 400),

            new Coin(1600, 100),

            new Coin(2195, 400),
            new Coin(2265, 330),
            new Coin(2375, 300),
            new Coin(2475, 300),
            new Coin(2565, 330),
            new Coin(2635, 400),

            new Coin(4100, 250),

            new PoisonBottle(625, 400, true),
            new PoisonBottle(2400, 400, false),
        ],

        [
            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", -720),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", -720),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", -720),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", -720),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 0),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 0),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 0),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 0),
            new BackgroundObject("assets/img/3. Background/Layers/1. Light/1.png", 0),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 720),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 720),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 720),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 720),
            new BackgroundObject("assets/img/3. Background/Layers/1. Light/2.png", 720),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 1440),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 1440),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 1440),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 1440),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 2160),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 2160),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 2160),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 2160),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 2880),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 2880),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 2880),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 2880),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 3600),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 3600),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 3600),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 3600),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 4320),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 4320),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 4320),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 4320),
        ],
    );
}
