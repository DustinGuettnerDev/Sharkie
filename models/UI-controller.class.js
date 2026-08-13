/**
 * Manages UI elements, game state transitions, fullscreen behavior, and audio controls.
 */
class UIController {
    canvas = null;
    control = null;
    locStorage = null;
    world = null;
    audioTrack = null;
    gameStarted = false;
    isMuted = false;
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
    title = null;
    landscapeQuery = null;
    sharkIndex = null;
    keyboardKeysInfo = null;
    audiosPlaying = [];
    resumeButton = null;
    menuButton = null;

    /**
     * Initializes the UI controller and wires the main listeners.
     * @param {HTMLCanvasElement} canvas Game canvas.
     * @param {Control} control Input controller.
     * @param {LocalStorage} locStorage Local storage helper.
     */
    constructor(canvas, control, locStorage, audioTrack) {
        this.canvas = canvas;
        this.control = control;
        this.locStorage = locStorage;
        this.audioTrack = audioTrack;
        this.cacheMainUiElements();
        this.cacheSecondaryUiElements();
        this.initLandscapeListeners();
        this.initUiKeys();
        this.handleLandscape();
        this.applyStoredMuteState();
    }

    /**
     * Caches the main game-flow UI elements.
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
        this.resumeButton = document.getElementById("resume-button-id");
        this.menuButton = document.getElementById("menu-button-id");
    }

    /**
     * Caches layout and system UI elements.
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

    /**
     * Registers orientation and resize listeners.
     */
    initLandscapeListeners() {
        this.landscapeQuery = window.matchMedia("(orientation: landscape)");
        this.landscapeQuery.addEventListener("change", () => this.handleLandscape());
        window.addEventListener("resize", () => this.handleLandscape());
    }

    /**
     * Binds UI button actions.
     */
    initUiKeys() {
        this.startButton.addEventListener("click", () => this.startGame());
        this.resumeButton.addEventListener("click", () => this.resumeFromPauseButton());
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.helpButton.addEventListener("click", () => this.showHelp());
        this.muteButton.addEventListener("click", () => this.toggleMute());
        this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());
        this.menuButton.addEventListener("click", () => this.goBackToMenu());
    }

    /**
     * Applies the stored mute state to all audio tracks.
     */
    applyStoredMuteState() {
        this.isMuted = this.locStorage.getSingleItem("muted");
        this.setMuteState(AUDIO_PATHS, this.isMuted);
        this.visualizeMute();
    }

    /**
     * Toggles the mute state.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.locStorage.setSingleItem("muted", this.isMuted);
        this.setMuteState(AUDIO_PATHS, this.isMuted);
        this.visualizeMute();
    }

    /**
     * Applies the mute state to every AudioTrack in the tree.
     * @param {object} node Audio tree node.
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
     * Reflects the current mute state via a CSS class on the mute button.
     */
    visualizeMute() {
        this.muteButton.classList.toggle("game-container__mute-btn--muted", Boolean(this.isMuted));
    }

    /**
     * Starts a new game round and hides the start screen and intro controls.
     */
    startGame() {
        if (this.isMobile() && !this.isLandscape()) {
            return;
        }

        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.world = new World(this.canvas, this.control, this, this.locStorage);
        this.startButton.classList.add("hidden");
        this.resumeButton.classList.add("hidden");
        if (this.startScreen) {
            this.startScreen.classList.add("hidden");
        }
    }

    /**
     * Restarts the game and hides the end-screen overlay and related controls.
     */
    restartGame() {
        if (this.isMobile() && !this.isLandscape()) {
            return;
        }

        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.gameEndContainer.classList.add("hidden");
        this.gameOverImage.classList.add("hidden");
        this.youWinImage.classList.add("hidden");
        this.resumeButton.classList.add("hidden");
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
     * Toggles fullscreen mode on the root element.
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
     * Hides the title and footer on mobile landscape or when fullscreen is active on desktop.
     */
    updateTitleAndFooterVisibility(isMobile, isLandscape) {
        const isFullscreen = Boolean(document.fullscreenElement);
        const shouldHideTitleAndFooter = (isMobile && isLandscape) || (!isMobile && isFullscreen);
        this.title.classList.toggle("hidden", shouldHideTitleAndFooter);
        this.footer.classList.toggle("hidden", shouldHideTitleAndFooter);
    }

    /**
     * Updates the responsive layout and visibility of overlay-dependent UI elements.
     */
    handleLandscape() {
        const isMobile = this.isMobile();
        const isLandscape = this.isLandscape();
        this.updateTitleAndFooterVisibility(isMobile, isLandscape);
        this.updateUiElementVisibility(isMobile, isLandscape);
        this.handleLockScreen(isMobile, isLandscape);
        this.handleGamePlayState(isMobile, isLandscape);
    }

    /**
     * Updates the visibility of layout-dependent UI elements for the current device and orientation.
     * @param {boolean} isMobile Whether the current device is mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    updateUiElementVisibility(isMobile, isLandscape) {
        this.fullscreenButton.classList.toggle("hidden", isMobile);
        this.mobileControls.classList.toggle("hidden", !(isMobile && isLandscape));
        this.keyboardKeysInfo.classList.toggle("hidden", isMobile);
        this.sharkIndex.classList.toggle("shark--landscape", isMobile && isLandscape);
        this.gameContainer.classList.toggle("game-container--landscape", isMobile && isLandscape);
        this.updateResumeButtonVisibility(isMobile, isLandscape);
        this.updateRestartButtonVisibility(isMobile, isLandscape);
    }

    /**
     * Shows the resume button only when gameplay is paused and the current layout allows it.
     * @param {boolean} isMobile Whether the current device is mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    updateResumeButtonVisibility(isMobile, isLandscape) {
        if (!this.world || !this.gameStarted || this.isEndScreenVisible()) {
            this.resumeButton.classList.add("hidden");
            return;
        }

        const shouldShowResumeButton = this.world.isPaused && (!isMobile || isLandscape);
        this.resumeButton.classList.toggle("hidden", !shouldShowResumeButton);
    }

    /**
     * Hides the restart control in portrait mode on mobile.
     * @param {boolean} isMobile Whether the current device is mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    updateRestartButtonVisibility(isMobile, isLandscape) {
        const shouldHideRestartButton = isMobile && !isLandscape;
        this.restartButton.classList.toggle("hidden", shouldHideRestartButton);
    }

    /**
     * Pauses gameplay when the device switches to portrait mode on mobile.
     * @param {boolean} isMobile Whether the current device is mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    handleGamePlayState(isMobile, isLandscape) {
        if (!this.gameStarted) return;
        if (!isLandscape && isMobile) {
            this.pause();
        }
    }

    /**
     * Shows or hides the lock screen and start button based on device and orientation while keeping the end screen hidden.
     * @param {boolean} isMobile Whether the current device is treated as mobile.
     * @param {boolean} isLandscape Whether the current orientation is landscape.
     */
    handleLockScreen(isMobile, isLandscape) {
        if (!isMobile) {
            this.lockScreen.classList.add("hidden");
            const shouldShowStartButton = !this.gameStarted && !this.isEndScreenVisible();
            this.startButton.classList.toggle("hidden", !shouldShowStartButton);
            return;
        }

        const shouldShowLockScreen = !isLandscape;
        this.lockScreen.classList.toggle("hidden", !shouldShowLockScreen);
        const shouldShowStartButtonOnMobile = isLandscape && !this.gameStarted && !this.isEndScreenVisible();
        this.startButton.classList.toggle("hidden", !shouldShowStartButtonOnMobile);
    }

    /**
     * Checks whether the end screen is visible.
     * @returns {boolean} True when the end screen is shown.
     */
    isEndScreenVisible() {
        return !this.gameEndContainer.classList.contains("hidden");
    }

    /**
     * Detects whether the current device should use the mobile or tablet UI.
     * @returns {boolean} True when the device has touch input and its largest viewport side is within the tablet limit.
     */
    isMobile() {
        // Touch-like input: finger-driven devices usually report a coarse pointer and no hover.
        const touchLike = window.matchMedia("(pointer: coarse) and (hover: none)").matches;

        // Use the larger viewport side so portrait and landscape use the same device limit.
        const largestViewportSide = Math.max(window.innerWidth, window.innerHeight);
        const smallViewport = largestViewportSide <= 1368;

        // Fallback for devices that expose touch through maxTouchPoints.
        const hasTouch = navigator.maxTouchPoints > 0;

        // Require both a tablet-sized viewport and touch capability.
        return smallViewport && (touchLike || hasTouch);
    }

    /**
     * @returns {boolean} True when the current viewport is wider than it is high.
     */
    isLandscape() {
        return window.innerWidth > window.innerHeight;
    }

    /**
     * Pauses gameplay and stores the tracks to resume.
     */
    pause() {
        this.world.isPaused = true;
        this.audiosPlaying = [];
        this.forEachTrack(AUDIO_PATHS, (track) => {
            if (track.isPaused || track.isPlaying) {
                this.audiosPlaying.push(track);
                track.pause();
            }
        });
        this.updateResumeButtonVisibility(this.isMobile(), this.isLandscape());
    }

    /**
     * Resumes the game and the paused audio tracks.
     */
    resume() {
        this.world.isPaused = false;
        this.world.render();
        if (!this.isMuted && !this.world.gameEnd) {
            this.audiosPlaying.forEach((track) => {
                if (track.isPaused) {
                    track.play();
                }
            });
        }
        this.audiosPlaying = [];
        this.updateResumeButtonVisibility(this.isMobile(), this.isLandscape());
    }

    /**
     * Resumes the game from the explicit pause-button flow.
     */
    resumeFromPauseButton() {
        this.resume();
    }

    /**
     * Calls the callback for every AudioTrack in the audio tree.
     * @param {object} node Audio tree node.
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

    /**
     * Stops all game loops, clears the canvas, and returns to the main menu.
     */
    goBackToMenu() {
        this.world.stopAllLoops();
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameStarted = false;
        this.startScreen.classList.remove("hidden");
        this.startButton.classList.remove("hidden");
        this.gameEndContainer.classList.add("hidden");
    }
}
