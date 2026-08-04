/**
 * Manages UI elements, game state transitions, fullscreen behavior, and audio controls.
 */
class UIController {
    canvas = null;
    control = null;
    locStorage = null;
    gameStarted = false;
    startButton = null;
    startScreen = null;
    restartButton = null;
    gameEndContainer = null;
    gameOverImage = null;
    youWinImage = null;
    helpButton = null;
    helpContainer = null;
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
    keyboardKeysInfo = null;

    /**
     * Initializes the UI controller by caching DOM elements and wiring event listeners.
     * @param {HTMLCanvasElement} canvas Game canvas.
     * @param {Control} control Input controller.
     * @param {LocalStorage} locStorage Local storage helper.
     */
    constructor(canvas, control, locStorage) {
        this.canvas = canvas;
        this.control = control;
        this.locStorage = locStorage;
        this.cacheMainUiElements();
        this.cacheSecondaryUiElements();
        this.initLandscapeListeners();
        this.initUiKeys();
        this.handleLandscape();
        this.applyStoredMuteState();
    }

    /**
     * Caches game-flow UI elements that are directly tied to starting, restarting,
     * and showing in-game overlays such as help and end screens.
     */
    cacheMainUiElements() {
        this.gameContainer = document.getElementById("game-container-id");
        this.startButton = document.getElementById("start-button-id");
        this.startScreen = document.getElementById("start-screen-id");
        this.restartButton = document.getElementById("restart-button-id");
        this.gameEndContainer = document.getElementById("game-end-container-id");
        this.gameOverImage = document.getElementById("game-over-id");
        this.youWinImage = document.getElementById("you-win-id");
        this.helpButton = document.getElementById("help-button-id");
        this.helpContainer = document.getElementById("help-id");
    }

    /**
     * Caches layout and system UI elements used for device adaptation,
     * fullscreen behavior, audio toggling, and page-level visibility updates.
     */
    cacheSecondaryUiElements() {
        this.fullscreenButton = document.getElementById("fullscreen-button-id");
        this.htmlElement = document.querySelector("html");
        this.muteButton = document.getElementById("mute-button-id");
        this.mobileControls = document.getElementById("mobile-controls-id");
        this.lockScreen = document.getElementById("lock-screen-id");
        this.footer = document.getElementById("footer-id");
        this.title = document.getElementById("shark-title-id");
        this.sharkIndex = document.getElementById("shark-index-id");
        this.keyboardKeysInfo = document.getElementById("keyboard-keys-information-id");
    }

    initLandscapeListeners() {
        this.landscapeQuery = window.matchMedia("(orientation: landscape)");
        this.landscapeQuery.addEventListener("change", () => this.handleLandscape());
        window.addEventListener("resize", () => this.handleLandscape());
    }

    /**
     * Binds the UI buttons to their controller actions.
     */
    initUiKeys() {
        this.startButton.addEventListener("click", () => this.startGame());
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.helpButton.addEventListener("click", () => this.showHelp());
        this.muteButton.addEventListener("click", () => this.toggleMute());
        this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());
    }

    /**
     * Applies the stored mute state to all audio tracks and updates the mute label.
     */
    applyStoredMuteState() {
        this.isMuted = this.locStorage.getSingleItem("muted");
        this.setMuteState(AUDIO_PATHS, this.isMuted);
        this.visualizeMute();
    }

    /**
     * Toggles mute state and updates the button label.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.locStorage.setSingleItem("muted", this.isMuted);
        this.setMuteState(AUDIO_PATHS, this.isMuted);
        this.visualizeMute();
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

    /**
     * Updates the mute button label based on the current mute state.
     */
    visualizeMute() {
        if (this.isMuted) {
            this.muteButton.innerText = "AUDIO OFF";
        } else {
            this.muteButton.innerHTML = "AUDIO ON";
        }
    }

    /**
     * Starts a new game round and hides the start button.
     */
    startGame() {
        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.world = new World(this.canvas, this.control, this, this.locStorage);
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
        this.world = new World(this.canvas, this.control, this, this.locStorage);
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
    async toggleFullscreen() {
        if (!document.fullscreenElement) {
            await this.htmlElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
        this.updateTitleAndFooterVisibility();
    }

    /**
     * Toggles title and footer visibility based on device type and fullscreen state.
     */
    updateTitleAndFooterVisibility() {
        const isMobile = this.isMobile();
        const isLandscape = this.isLandscape();
        const isFullscreen = Boolean(document.fullscreenElement);
        const shouldHideTitleAndFooter = (isMobile && isLandscape) || (!isMobile && isFullscreen);
        this.title.classList.toggle("hidden", shouldHideTitleAndFooter);
        this.footer.classList.toggle("hidden", shouldHideTitleAndFooter);
    }

    /**
     * Adjusts UI layout and control visibility for landscape orientation on mobile devices.
     */
    handleLandscape() {
        const isMobile = this.isMobile();
        const isLandscape = this.landscapeQuery.matches;
        this.updateTitleAndFooterVisibility();
        this.updateUiElementVisibility(isMobile, isLandscape);
        this.handleLockScreen(isMobile, isLandscape);
        this.handleGamePlayState(isMobile, isLandscape);
    }

    /**
     * Toggles visibility of UI elements that depend on device type and orientation.
     * @param {boolean} isMobile Whether the current device is mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    updateUiElementVisibility(isMobile, isLandscape) {
        this.fullscreenButton.classList.toggle("hidden", isMobile);
        this.mobileControls.classList.toggle("hidden", !(isMobile && isLandscape));
        this.keyboardKeysInfo.classList.toggle("hidden", isMobile);
        this.sharkIndex.classList.toggle("shark--landscape", isMobile && isLandscape);
        this.gameContainer.classList.toggle("game-container--landscape", isMobile && isLandscape);
    }

    /**
     * Pauses or resumes the game depending on whether a mobile device is in portrait mode.
     * @param {boolean} isMobile Whether the current device is mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    handleGamePlayState(isMobile, isLandscape) {
        if (!this.gameStarted) return;
        if (!isLandscape && isMobile) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Manages lock screen and start button visibility based on device type and orientation.
     * @param {boolean} isMobile Whether the current device is treated as mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    handleLockScreen(isMobile, isLandscape) {
        if (this.isEndScreenVisible()) {
            this.lockScreen.classList.add("hidden");
            this.startButton.classList.add("hidden");
            return;
        }

        if (!isMobile) {
            this.lockScreen.classList.add("hidden");
            this.startButton.classList.remove("hidden");
        } else {
            this.lockScreen.classList.toggle("hidden", isLandscape);
            this.startButton.classList.toggle("hidden", !isLandscape || this.gameStarted);
        }
    }

    /**
     * Checks whether the game-end overlay is currently visible.
     * @returns {boolean} True when the restart/end screen is shown.
     */
    isEndScreenVisible() {
        return !this.gameEndContainer.classList.contains("hidden");
    }

    /**
     * Detects whether the current device should be treated as mobile.
     * @returns {boolean} True when pointer and viewport heuristics indicate a mobile device.
     */
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
     * @returns {boolean} True if the current orientation is landscape.
     */
    isLandscape() {
        return window.matchMedia("(orientation: landscape)").matches;
    }

    /**
     * Pauses the game loop and all audio tracks.
     */
    pause() {
        this.world.isPaused = true;
        this.forEachTrack(AUDIO_PATHS, (t) => t.pause());
    }

    /**
     * Resumes the game loop and all audio tracks unless muted or game has ended.
     */
    resume() {
        this.world.isPaused = false;
        this.world.render();
        if (!this.isMuted && !this.world.gameEnd) {
            this.forEachTrack(AUDIO_PATHS, (t) => t.play());
        }
    }

    /**
     * Calls the given callback for every AudioTrack instance in the audio tree.
     * @param {object} node Audio tree node to traverse.
     * @param {Function} callback Function to call with each AudioTrack.
     */
    forEachTrack(node, callback) {
        for (const value of Object.values(node)) {
            if (value instanceof AudioTrack) {
                callback(value);
            } else {
                this.forEachTrack(value, callback);
            }
        }
    }
}
