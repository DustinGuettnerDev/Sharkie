/**
 * Manages UI elements, game state transitions, fullscreen behavior, and audio controls.
 */
class UIController {
    gameStarted = false;
    startButton = null;
    startScreen = null;
    restartButton = null;
    gameEndContainer = null;
    gameOverImage = null;
    youWinImage = null;
    helpButton = null;
    helpContainer = null;
    keyboardKeysInformation = null;
    fullscreenButton = null;
    gameContainer = null;
    htmlElement = null;
    muteButton = null;
    mobileControls = null;
    lockScreen = null;
    footer = null;
    world = null;
    isMuted = false;
    title = null;
    landscapeQuery = null;
    sharkIndex = null;

    constructor() {
        this.gameContainer = document.getElementById("game-container-id");
        this.startButton = document.getElementById("start-button-id");
        this.startScreen = document.getElementById("start-screen-id");
        this.restartButton = document.getElementById("restart-button-id");
        this.gameEndContainer = document.getElementById("game-end-container-id");
        this.gameOverImage = document.getElementById("game-over-id");
        this.youWinImage = document.getElementById("you-win-id");
        this.helpButton = document.getElementById("help-button-id");
        this.helpContainer = document.getElementById("help-id");
        this.keyboardKeysInformation = document.getElementById("keyboard-keys-information-id");
        this.fullscreenButton = document.getElementById("fullscreen-button-id");
        this.htmlElement = document.querySelector("html");
        this.muteButton = document.getElementById("mute-button-id");
        this.mobileControls = document.getElementById("mobile-controls-id");
        this.lockScreen = document.getElementById("lock-screen-id");
        this.footer = document.getElementById("footer-id");
        this.title = document.getElementById("shark-title-id");
        this.sharkIndex = document.getElementById("shark-index-id");
        this.world = world;
        this.landscapeQuery = window.matchMedia("(orientation: landscape)");
        this.landscapeQuery.addEventListener("change", () => this.handleLandscape());
        this.initUiKeys();
        this.handleLandscape();
    }

    isMobile() {
        // Touch-like input: finger-driven devices usually report a coarse pointer and no hover.
        const touchLike = window.matchMedia("(pointer: coarse) and (hover: none)").matches;

        // Keep a viewport guard so very large screens are not treated as mobile.
        const smallViewport = window.matchMedia("(max-width: 1024px)").matches;

        // Extra fallback: some devices expose touch through maxTouchPoints.
        const hasTouch = navigator.maxTouchPoints > 0;

        // Consider it mobile only when viewport is small and touch capability is present.
        return smallViewport && (touchLike || hasTouch);
    }

    /**
     * Binds the UI buttons to their controller actions.
     */
    initUiKeys() {
        this.startButton.addEventListener("click", () => this.startGame());
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.helpButton.addEventListener("click", () => this.showHelp());
        this.muteButton.addEventListener("click", () => this.toggleMute());
        /* document.addEventListener("fullscreenchange", () => this.handleFullscreenChange()); */
    }

    /**
     * Starts a new game round and hides the start button.
     */
    startGame() {
        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.world = new World(canvas, control, uiController);
        this.startButton.classList.add("hidden");
        if (this.startScreen) {
            this.startScreen.classList.add("hidden");
        }
    }

    /**
     * Restarts the game by clearing the end-screen UI and creating a fresh world instance.
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
     * Requests or exits fullscreen mode on the root HTML element.
     * The layout and gameplay updates are handled in handleFullscreenChange().
     */
    toggleFullscreen(isLandscape) {
        if (!document.fullscreenElement) {
            this.htmlElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
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

    handleLandscape() {
        const isMobile = this.isMobile();
        const isLandscape = this.landscapeQuery.matches;
        this.title.classList.toggle("hidden", isMobile && isLandscape);
        this.footer.classList.toggle("hidden", isMobile && isLandscape);
        this.mobileControls.classList.toggle("hidden", !(isMobile && isLandscape));
        this.sharkIndex.classList.toggle("shark--landscape", isMobile && isLandscape);
        this.gameContainer.classList.toggle("game-container--landscape", isMobile && isLandscape);
        this.handleLockScreen(isMobile, isLandscape);
    }

    handleLockScreen(isMobile, isLandscape) {
        if (!isMobile) {
            this.lockScreen.classList.add("hidden");
            this.startButton.classList.remove("hidden");
        } else {
            this.lockScreen.classList.toggle("hidden", isLandscape);
            this.startButton.classList.toggle("hidden", !isLandscape);
        }
    }

    /**
     * Restores the default canvas dimensions when exiting fullscreen.
     */
    #resetCalcSize() {
        this.gameContainer.style.width = "";
        this.gameContainer.style.height = "";
    }

    /**
     * Pauses gameplay by freezing the world update loop.
     */
    pause() {
        this.world.isPaused = true;
    }

    /**
     * Resumes gameplay and restarts the render loop if needed.
     */
    resume() {
        this.world.isPaused = false;
        if (!this.world.renderFrameId) {
            this.world.render();
        }
    }
}
