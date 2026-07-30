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
     * Caches frequently used DOM elements and registers event listeners for fullscreen and orientation changes.
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
        this.lockScreen = document.getElementById("lock-screen-id");
        this.world = world;
        this.updatePortraitVisibility();
        window.addEventListener("orientationchange", () => this.updatePortraitVisibility());
        this.initUiKeys();
    }

    /**
     * Returns true if the current device is a desktop or landscape screen.
     */
    isDesktopViewport() {
        return (
            !window.matchMedia("(max-width: 1024px) and (max-height: 1400px)").matches ||
            screen.width > screen.height
        );
    }

    /**
     * Shows or hides the start button and lock screen based on viewport and fullscreen state.
     */
    updatePortraitVisibility() {
        this.startButton.classList.toggle(
            "hidden",
            !this.isDesktopViewport() && !document.fullscreenElement,
        );
        this.lockScreen.classList.toggle(
            "hidden",
            this.isDesktopViewport() || document.fullscreenElement,
        );
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
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
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
     * Visual mobile-state classes are applied in handleFullscreenChange() via fullscreenchange.
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
     * Updates the UI whenever the fullscreen state changes.
     */
    handleFullscreenChange() {
        const isDesktop = this.isDesktopViewport();
        const title = document.querySelector(".game-container__title");
        const isFullscreen = Boolean(document.fullscreenElement);

        this.#updateFullscreenUi(isDesktop, isFullscreen, title);

        if (isFullscreen && !this.isDesktopViewport()) {
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
        if (isDesktop) {
            this.gameContainer.classList.remove("game-container--rotated");
            this.mobileControls.classList.add("hidden");
            return;
        }

        this.mobileControls.classList.toggle("hidden", !isFullscreen);
        this.gameContainer.classList.toggle("game-container--rotated", isFullscreen);
    }

    /**
     * Scales the game container to fill the viewport in mobile portrait fullscreen.
     */
    #calcCanvasSize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonSpacePercent = 0.7;
        const numbers = Array.from({ length: 100 }, (_, i) => 100 - i);

        for (const number of numbers) {
            const percent = number / 100;
            const calcHeight = viewportHeight * percent;
            const calcWidth = calcHeight * (2 / 3);

            if (calcWidth <= viewportWidth) {
                this.gameContainer.style.width = `${Math.round(calcHeight * buttonSpacePercent)}px`;
                this.gameContainer.style.height = `${Math.round(calcWidth * buttonSpacePercent)}px`;
                break;
            }
        }
    }

    /**
     * Resets the custom canvas dimensions when fullscreen is left.
     */
    #resetCalcSize() {
        this.gameContainer.style.width = "";
        this.gameContainer.style.height = "";
    }
}
