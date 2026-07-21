/**
 * Wraps a single audio track with optional repeat and optional cut-off timing.
 * The optional cut-off is defined by an absolute track timestamp.
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
     * @param {?number} timeEnd Optional absolute cut-off position in seconds.
     * The constructor converts it to a relative duration from timeBegin. (default: null)
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
     * Starts playback and applies optional cut-off and repeat behavior.
     * Clears any previously scheduled cut-off before creating a new one.
     */
    play() {
        if (!this.audio || this.isPlaying) return;
        this.audio.play();

        clearTimeout(this.timeoutId);

        if (this.timeEnd) {
            this.timeoutId = setTimeout(() => {
                this.audio.pause();
                this.audio.currentTime = this.timeBegin;

                if (this.repeat) {
                    this.play();
                }
            }, this.timeEnd);
        } else if (this.repeat) {
            this.audio.addEventListener("ended", this.#repeatPlayIfNormalEnded);
        }
    }

    /**
     * Replays the track from timeBegin after a normal end when repeat is enabled.
     */
    #repeatPlayIfNormalEnded() {
        this.audio.removeEventListener("ended", this.#repeatPlayIfNormalEnded);
        this.audio.currentTime = this.timeBegin;
        this.play();
    }

    get isPlaying() {
        return !this.audio.paused && this.audio.currentTime > 0;
    }

    /**
     * Enables or disables browser-level mute for this audio track.
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.audio.muted = muted;
    }

    /**
     * Stops playback, resets position to start, clears pending cut-off timer,
     * and removes the repeat listener.
     */
    stop() {
        if (!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = this.timeBegin;
        clearTimeout(this.timeoutId);
        this.audio.removeEventListener("ended", this.#repeatPlayIfNormalEnded);
    }
}
