/**
 * Creates and returns the first level of the game.
 * @returns {Level} The first level of the game.
 */
function createLevel_1() {
    const endboss = new Endboss();
    endboss.x = 7400;
    endboss.appearingPositionTrigger = 6800;

    return new Level(
        [
            new Puffer(350, 0.5),
            new JellyFish(550, 0.7),
            new Puffer(950, 1),
            new Puffer(1350, 0.6),
            new JellyFish(1550, 1.4),
            new Puffer(2100, 0.8),
            new JellyFish(2400, 0.9),
            new Puffer(2700, 1.8),
            new Puffer(2900, 1.3),
            new JellyFish(3000, 0.9),
            new Puffer(3450, 0.7),
            new JellyFish(3700, 1.1),
            new Puffer(3950, 1.4),
            new JellyFish(4200, 0.8),
            new Puffer(4550, 1.7),
            new JellyFish(4850, 1.2),
            new Puffer(5150, 0.9),
            new JellyFish(5450, 1.5),
            new Puffer(5750, 1.1),
            new JellyFish(6050, 0.75),
            new Puffer(6350, 1.9),
            new JellyFish(6650, 1.3),
            new Puffer(6950, 1.6),
            new JellyFish(7200, 1.0),
            new Puffer(7480, 2.0),
            new Puffer(7700, 1.0),
            new JellyFish(7720, 1.35),
            new Puffer(7780, 0.6),
            new JellyFish(7800, 0.8),
            new JellyFish(8800, 0.8),
            new JellyFish(9000, 0.35),
            new Puffer(8900, 0.6),
        ],

        endboss,

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

            // Arch from top to bottom and back to top.
            new Coin(4500, 120),
            new Coin(4580, 180),
            new Coin(4660, 250),
            new Coin(4740, 340),
            new Coin(4820, 250),
            new Coin(4900, 180),
            new Coin(4980, 120),

            // Classic shallow coin arc.
            new Coin(5450, 400),
            new Coin(5520, 330),
            new Coin(5630, 300),
            new Coin(5730, 300),
            new Coin(5820, 330),
            new Coin(5890, 400),

            // Wider top -> down -> top pattern for the second half.
            new Coin(6350, 110),
            new Coin(6460, 170),
            new Coin(6570, 240),
            new Coin(6680, 320),
            new Coin(6790, 380),
            new Coin(6900, 320),
            new Coin(7010, 240),
            new Coin(7120, 170),
            new Coin(7230, 110),

            // Final reward arc close to level end.
            new Coin(7480, 390),
            new Coin(7560, 330),
            new Coin(7660, 290),
            new Coin(7760, 290),
            new Coin(7860, 330),
            new Coin(7940, 390),

            new PoisonBottle(625, 400, true),
            new PoisonBottle(2400, 400, false),
            new PoisonBottle(5200, 390, false),
            new PoisonBottle(7050, 390, true),
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

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 5040),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 5040),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 5040),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 5040),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 5760),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 5760),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 5760),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 5760),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 6480),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 6480),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 6480),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 6480),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 7200),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 7200),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 7200),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 7200),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 7920),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 7920),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 7920),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 7920),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D1.png", 8640),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D1.png", 8640),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D1.png", 8640),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D1.png", 8640),

            new BackgroundObject("assets/img/3. Background/Layers/5. Water/D2.png", 9360),
            new BackgroundObject("assets/img/3. Background/Layers/4.Fondo 2/D2.png", 9360),
            new BackgroundObject("assets/img/3. Background/Layers/3.Fondo 1/D2.png", 9360),
            new BackgroundObject("assets/img/3. Background/Layers/2. Floor/D2.png", 9360),
        ],
        -1,
        8000,
    );
}
