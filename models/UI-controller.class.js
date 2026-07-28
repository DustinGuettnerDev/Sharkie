/**
 * Manages game UI elements, game state transitions, and display/audio controls.
 */
class UIController {
    gameStarted = false;
    startButton = null;
    restartButton = null;
    gameEndContainer = null;
    gameOverImage = null;
    youWinImage = null;
    helpButton = null;
    helpContainer = null;
    fullscreenButton = null;
    gameContainer = null;
    world = null;
    isMuted = false;

    /**
     * Caches frequently used DOM elements and subscribes to fullscreen state changes.
     */
    constructor() {
        this.gameContainer = document.getElementById("game-container-id");
        this.startButton = document.getElementById("start-button-id");
        this.restartButton = document.getElementById("restart-button-id");
        this.gameEndContainer = document.getElementById("game-end-container-id");
        this.gameOverImage = document.getElementById("game-over-id");
        this.youWinImage = document.getElementById("you-win-id");
        this.helpButton = document.getElementById("help-button-id");
        this.helpContainer = document.getElementById("help-id");
        this.fullscreenButton = document.getElementById("fullscreen-button-id");
        this.htmlElement = document.querySelector("html");
        this.muteButton = document.getElementById("mute-button-id");
        this.mobileControls = document.getElementById("mobile-controls-id");
        this.keyboardInfos = document.getElementById("keyboard-keys-information-id");
        this.world = world;

        this.initUiKeys();
    }

    /**
     * Binds UI button interactions to the controller methods.
     */
    initUiKeys() {
        this.startButton.addEventListener("click", () => this.startGame());
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.helpButton.addEventListener("click", () => this.showHelp());
        this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());
        this.muteButton.addEventListener("click", () => this.toggleMute());
        document.addEventListener("fullscreenchange", () => this.syncFullscreenUi());
    }

    /**
     * Starts a new game world and hides the start button.
     */
    startGame() {
        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.world = new World(canvas, control, uiController);
        this.startButton.classList.add("hidden");
    }

    /**
     * Restarts the game by hiding end-game UI and creating a fresh world instance.
     */
    restartGame() {
        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.gameEndContainer.classList.add("hidden");
        this.gameOverImage.classList.add("hidden");
        this.youWinImage.classList.add("hidden");
        this.world.stopAllLoops();
        this.world = new World(canvas, control, uiController);
    }

    /**
     * Toggles visibility of the help overlay.
     */
    showHelp() {
        this.helpContainer.classList.toggle("hidden");
    }

    /**
     * Requests or exits fullscreen on the root HTML element.
     * Visual mobile-state classes are applied in syncFullscreenUi() via fullscreenchange.
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.htmlElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Synchronizes mobile rotation and title visibility with the real fullscreen state.
     * This also handles fullscreen exits triggered outside the button (e.g. ESC/system UI).
     */
    syncFullscreenUi() {
        const isMobile = window.matchMedia("(max-width: 480px)").matches;
        const title = document.querySelector("h1");
        const isFullscreen = Boolean(document.fullscreenElement);

        if (!isMobile) {
            this.gameContainer.classList.remove("game-container--rotated");
            title.classList.remove("d_none");
            this.mobileControls.classList.add("hidden");
            return;
        }

        this.mobileControls.classList.toggle("hidden", !isFullscreen);
        this.gameContainer.classList.toggle("game-container--rotated", isFullscreen);
        title.classList.toggle("d_none", isFullscreen);
    }

    /**
     * Toggles mute state and updates the button label.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.setMuteState(AUDIO_PATHS, this.isMuted);

        if (this.isMuted) {
            this.muteButton.innerText = "AUDIO OFF";
        } else {
            this.muteButton.innerHTML = "AUDIO";
        }
    }

    /**
     * Applies mute state to all configured AudioTrack instances.
     * @param {object} node Audio tree object.
     * @param {boolean} muted Target mute state.
     */
    setMuteState(node, muted) {
        for (const value of Object.values(node)) {
            if (!(value instanceof AudioTrack)) {
                this.setMuteState(value, muted);
            } else {
                value.setMuted(muted);
            }
        }
    }
}
