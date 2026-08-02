/**
 * Manages UI elements, game state transitions, fullscreen behavior, and audio controls.
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
    htmlElement = null;
    muteButton = null;
    mobileControls = null;
    lockScreen = null;
    footer = null;
    world = null;
    isMuted = false;

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
        this.lockScreen = document.getElementById("lock-screen-id");
        this.footer = document.getElementById("footer-id");
        this.world = world;
        this.updatePortraitVisibility();
        window.addEventListener("orientationchange", () => {
            if (document.fullscreenElement) {
                this.handleFullscreenChange();
            }
        });
        document.addEventListener("fullscreenchange", () => this.updatePortraitVisibility());
        this.initUiKeys();
    }

    /**
     * Returns true when the current viewport behaves like a desktop or landscape screen.
     */
    isDesktopViewport() {
        return (
            !window.matchMedia("(max-width: 1024px) and (max-height: 1400px)").matches ||
            screen.width > screen.height
        );
    }

    /**
     * Shows or hides the start button and lock screen based on viewport, fullscreen, and game state.
     */
    updatePortraitVisibility() {
        const inRestart = !this.gameEndContainer.classList.contains("hidden");
        const shouldHideStartButton =
            (!this.isDesktopViewport() && !document.fullscreenElement) ||
            this.gameStarted ||
            inRestart;

        this.startButton.classList.toggle("hidden", shouldHideStartButton);
        this.lockScreen.classList.toggle(
            "hidden",
            this.isDesktopViewport() || document.fullscreenElement,
        );
    }

    /**
     * Binds the UI buttons to their controller actions.
     */
    initUiKeys() {
        this.startButton.addEventListener("click", () => this.startGame());
        this.restartButton.addEventListener("click", () => this.restartGame());
        this.helpButton.addEventListener("click", () => this.showHelp());
        this.fullscreenButton.addEventListener("click", () => this.toggleFullscreen());
        this.muteButton.addEventListener("click", () => this.toggleMute());
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
    }

    /**
     * Starts a new game round and hides the start button.
     */
    startGame() {
        AUDIO_PATHS.background.main.play();
        this.gameStarted = true;
        this.world = new World(canvas, control, uiController);
        this.startButton.classList.add("hidden");
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
    toggleFullscreen() {
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

    /**
     * Handles fullscreen transitions for layout updates, gameplay pause/resume behavior, and canvas sizing.
     */
    handleFullscreenChange() {
        const isDesktop = this.isDesktopViewport();
        const title = document.getElementById("shark-title-id");
        const isFullscreen = Boolean(document.fullscreenElement);

        this.#handleGameStateForFullscreen(isDesktop, isFullscreen);
        this.#updateFullscreenUi(isDesktop, isFullscreen, title);
        this.#updateFullscreenLayout(isDesktop, isFullscreen);
    }

    /**
     * Pauses or resumes the game when entering or leaving fullscreen on mobile.
     */
    #handleGameStateForFullscreen(isDesktop, isFullscreen) {
        if (!this.gameStarted || isDesktop) {
            return;
        }

        if (isFullscreen) {
            this.resume();
        } else {
            this.pause();
        }
    }

    /**
     * Applies the responsive canvas sizing needed for fullscreen mode.
     */
    #updateFullscreenLayout(isDesktop, isFullscreen) {
        if (isFullscreen && !isDesktop) {
            this.#calcCanvasSize();
        } else {
            this.#resetCalcSize();
        }
    }

    /**
     * Applies the visual fullscreen state to the game container, title and mobile controls.
     */
    #updateFullscreenUi(isDesktop, isFullscreen, title) {
        title.classList.toggle("hidden", isFullscreen);
        this.footer.classList.toggle("hidden", isFullscreen);
        if (isDesktop) {
            this.gameContainer.classList.remove("game-container--rotated");
            this.mobileControls.classList.add("hidden");
            return;
        }
        this.mobileControls.classList.toggle("hidden", !isFullscreen);
        this.gameContainer.classList.toggle("game-container--rotated", isFullscreen);
    }

    /**
     * Calculates a canvas size that fits the available screen space in fullscreen.
     */
    #calcCanvasSize() {
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const buttonSpacePercent = 0.7;
        const numbers = Array.from({ length: 100 }, (_, i) => 100 - i);

        for (const number of numbers) {
            const percent = number / 100;
            const calcHeight = screenHeight * percent;
            const calcWidth = calcHeight * (2 / 3);

            if (calcWidth <= screenWidth) {
                this.gameContainer.style.width = `${Math.round(calcHeight * buttonSpacePercent)}px`;
                this.gameContainer.style.height = `${Math.round(calcWidth * buttonSpacePercent)}px`;
                break;
            }
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
