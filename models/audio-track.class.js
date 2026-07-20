/**
 * Wraps a single audio effect with optional start delay and optional cut-off timing.
 */
class AudioTrack {
    audio = null;
    timeDelayMs;
    isPlaying = false;

    /**
     * @param {string} audioPath Relative path to the audio file.
     * @param {number} volume Volume level for the audio track, from 0.0 (silent) to 1.0 (full volume). (default: 1)
     * @param {number} timeDelay Delay before playback starts, in seconds. (default: 0)
     */
    constructor(audioPath, volume = 1, timeDelay = 0) {
        this.audio = new Audio(audioPath);
        this.audio.volume = volume;
        this.timeDelayMs = timeDelay * 1000;
    }

    /**
     * Plays the sound after the configured delay and optionally pauses it after cut time.
     */
    play() {
        if (!this.audio || this.isPlaying) return;
        this.isPlaying = true;
        this.audio.play();
        setTimeout(() => {
            this.isPlaying = false;
        }, this.timeDelayMs);
    }

    /**
     * Enables or disables browser-level mute for this audio track.
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.audio.muted = muted;
    }

    stop() {
        if (!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }
}
