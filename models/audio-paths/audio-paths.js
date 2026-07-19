const AUDIO_PATHS = Object.freeze({
    character: {
        slap: new AudioTrack("assets/audio/shark/slap.mp3"),
        bubble: new AudioTrack("assets/audio/shark/bubble.mp3"),
        hurt: new AudioTrack("assets/audio/shark/hurt.mp3"),
    },
    collectibles: {
        coin: new AudioTrack("assets/audio/collectibles/coins.mp3"),
        hpUp: new AudioTrack("assets/audio/collectibles/hp-up.mp3"),
    },
});
