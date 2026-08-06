/**
 * A constant object that holds the audio tracks used in the game, organized by category.
 */
const AUDIO_PATHS = Object.freeze({
    character: {
        slap: new AudioTrack("assets/audio/character/slap.mp3"),
        bubble: new AudioTrack("assets/audio/character/bubble.mp3"),
        hurt: new AudioTrack("assets/audio/character/hurt.mp3", 1, 2),
        snoring: new AudioTrack("assets/audio/character/snoring.mp3", 0.2),
    },
    collectibles: {
        coin: new AudioTrack("assets/audio/collectibles/coins.mp3"),
        hpUp: new AudioTrack("assets/audio/collectibles/hp-up.mp3"),
        poison: new AudioTrack("assets/audio/collectibles/poison.mp3"),
    },
    enemies: {
        endboss: {
            attack: new AudioTrack("assets/audio/enemies/endboss/orca/attack.mp3"),
            hurt: new AudioTrack("assets/audio/enemies/endboss/orca/hurt.mp3", 1, 2),
            appear: new AudioTrack("assets/audio/enemies/endboss/orca/appear.mp3", 0.6, 0, 5.3),
        },
    },
    overlay: {
        gameOver: new AudioTrack("assets/audio/overlay/game-over.mp3"),
        youWin: new AudioTrack("assets/audio/overlay/you-win.mp3"),
    },
    background: {
        // Starts at 1.75s and loops at the 8:18 mark to skip trailing silence.
        main: new AudioTrack("assets/audio/background/main.mp3", 0.2, 1.75, 498, true),
    },
});
