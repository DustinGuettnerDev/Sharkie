/**
 * Wraps a single HTML audio track with optional repeat, cut-off timing, and reset behavior.
 * The cut-off is defined by an absolute track timestamp.
 */
class AudioTrack {
    timeEnd;
    repeat;
    timeBegin;
    timeoutId = null;

    /**
     * @param {string} audioPath Relative path to the audio file.
     * @param {number} volume Volume level for the audio track, from 0.0 (silent) to 1.0 (full volume). (default: 1)
     * @param {number} timeBegin Start position in seconds. (default: 0)
     * @param {?number} timeEnd Optional absolute cut-off position in seconds. The constructor converts it to a relative duration from timeBegin. (default: null)
     * @param {boolean} repeat Restarts playback after end or cut-off when true. (default: false)
     */
    constructor(audioPath, volume = 1, timeBegin = 0, timeEnd = null, repeat = false) {
        this.audio = new Audio(audioPath);
        this.audio.volume = volume;
        this.timeBegin = timeBegin;
        this.audio.currentTime = this.timeBegin;
        this.repeat = repeat;
        this.timeEnd = timeEnd ? (timeEnd - timeBegin) * 1000 : null;
    }

    /**
     * Starts playback and schedules the cut-off timer if configured.
     */
    play() {
        if (!this.audio || this.isPlaying) return;
        this.audio.play();
        this.setupPlaybackBehavior();
    }

    /**
     * Configures the cut-off timer after playback starts.
     */
    setupPlaybackBehavior() {
        clearTimeout(this.timeoutId);
        if (this.timeEnd) {
            this.setupCutoffTimer();
        }
    }

    /**
     * Schedules a timeout to pause and rewind the audio at the configured cut-off point.
     */
    setupCutoffTimer() {
        this.timeoutId = setTimeout(() => {
            this.audio.pause();
            this.audio.currentTime = this.timeBegin;
            if (this.repeat) {
                this.play();
            }
        }, this.timeEnd);
    }

    /**
     * Enables or disables browser-level mute for this audio track.
     * @param {boolean} muted Desired mute state.
     */
    setMuted(muted) {
        this.audio.muted = muted;
    }

    /**
     * Stops playback, resets to start position, and clears any pending cut-off timer.
     */
    stop() {
        if (!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = this.timeBegin;
        clearTimeout(this.timeoutId);
    }

    /**
     * Checks whether the audio track is currently playing.
     * @returns {boolean} True when playback is active, otherwise false.
     */
    get isPlaying() {
        return !this.audio.paused && this.audio.currentTime > 0;
    }
}
