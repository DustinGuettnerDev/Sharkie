/**
 * Wraps a single audio effect with optional start delay and optional cut-off timing.
 */
class AudioTrack {
    audio = null;
    timeDelayMs;
    timeAudioCutMs;

    /**
     * @param {string} audioPath Relative path to the audio file.
     * @param {number} timeDelay Delay before playback starts, in seconds.
     * @param {?number} timeAudioCut Optional cut-off duration after start, in seconds.
     */
    constructor(audioPath, timeDelay = 0, timeAudioCut = null) {
        this.audio = new Audio(audioPath);
        this.timeDelayMs = timeDelay * 1000;
        this.timeAudioCutMs = timeAudioCut ? timeAudioCut * 1000 : null;
    }

    /**
     * Plays the sound after the configured delay and optionally pauses it after cut time.
     */
    play() {
        if (!this.audio) return;

        setTimeout(() => {
            this.audio.play();
        }, this.timeDelayMs);

        if (this.timeAudioCutMs) {
            setTimeout(() => {
                this.audio.pause();
            }, this.timeDelayMs + this.timeAudioCutMs);
        }
    }

    /**
     * Enables or disables browser-level mute for this audio track.
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.audio.muted = muted;
    }
}
