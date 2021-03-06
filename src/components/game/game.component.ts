import { LitElement, html, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";
import {
  BLOCK_SIZE,
  MAP_SIZE,
  NEW_GAME,
  GAME_OVER,
  NEW_HIGH_SCORE,
  SCORE_INCREASED,
  HIGH_SCORE,
  DIFFICULTY_CHANGED,
  PAUSE_TOGGLED,
} from "../../config/constants";
import {
  broadcastGameUpdate,
  listenFor,
  removeCustomListener,
  getCanvas,
} from "../../utils/utils";
import gameStyles from "./game.component.sass";
import { GameEngine } from "./classes/engine";
import { Difficulty, FoodColor } from "../../models/enums";

@customElement("game-component")
export class SnakeGame extends LitElement {
  static styles = [gameStyles];
  engine?: GameEngine = {} as GameEngine; // engine and state stored locally, but later state will be stored remotely
  hideCursorTimeoutId: number | undefined;
  difficulty: Difficulty = Difficulty.easy;

  // -- pre-bound event listener callbacks (removing event listeners doesn't work unless you have pre-bound, named functions)
  boundMouseMoveCallback = this.mouseMoveEventListener.bind(this); // named this-bound callback for event listening
  boundScoreIncreasedCallback = this.scoreIncreasedCallback.bind(this);
  boundGameOverCallback = this.gameOverCallback.bind(this);
  boundNewGameCallback = this.newGameCallback.bind(this);
  boundDiffifcultyChangedCallback = this.difficultyChangedCallback.bind(this);
  boundPauseToggledCallback = this.pauseToggledCallback.bind(this);
  boundHighScoreCallback = this.highScoreCallback.bind(this);

  @property()
  score: number = 0; // declared as property so score gets rerendered when its value changes

  constructor() {
    super();

    // set high score to zero if first time loading game
    if (!localStorage.getItem(HIGH_SCORE)) {
      localStorage.setItem(HIGH_SCORE, "0");
    }

    /**
     * add event listeners ... can't be removed if passed anonymously
     */
    listenFor(GAME_OVER, this.boundGameOverCallback);
    listenFor(NEW_GAME, this.boundNewGameCallback);
    listenFor(SCORE_INCREASED, this.boundScoreIncreasedCallback);
    listenFor(DIFFICULTY_CHANGED, this.boundDiffifcultyChangedCallback);
    listenFor(PAUSE_TOGGLED, this.boundPauseToggledCallback);
    listenFor(NEW_HIGH_SCORE, this.boundHighScoreCallback);
  }

  firstUpdated() {
    // access canvas AFTER the page loads so it isn't null
    // draw green square instead of instantiating an entire game engine
    // const context = getCanvas().getContext('2d') as CanvasRenderingContext2D
    // context.beginPath();
    // context.fillStyle = FoodColor.green;
    // context.fillRect(
    //   MAP_SIZE/2 * BLOCK_SIZE,
    //   MAP_SIZE/2 * BLOCK_SIZE,
    //   BLOCK_SIZE,
    //   BLOCK_SIZE
    // );
  }

  /**
   * This function has references to this.engine, which could be causing the old engines to not be garbage collected
   * removeCustomListener fixes the error:
   *      Type 'Event' is missing the following properties from type 'CustomEvent<any>': detail, initCustomEvent
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(GAME_OVER, this.boundGameOverCallback);
    window.removeEventListener(NEW_GAME, this.boundNewGameCallback);
    window.removeEventListener(
      SCORE_INCREASED,
      this.boundScoreIncreasedCallback
    ); // does this actually remove the event? (no)
    removeCustomListener(
      DIFFICULTY_CHANGED,
      this.boundDiffifcultyChangedCallback
    );
    removeCustomListener(PAUSE_TOGGLED, this.boundPauseToggledCallback);
    window.removeEventListener(NEW_HIGH_SCORE, this.boundHighScoreCallback); // does this actually remove the event? (no)
  }

  // -- NAMED CALLBACKS so we can remove event listeners properly
  scoreIncreasedCallback(): void {
    this.score++;
  }
  gameOverCallback() {
    this.gameOver();
  }
  newGameCallback() {
    this.newGame();
  }
  difficultyChangedCallback(e: CustomEvent) {
    this.difficulty = e.detail.newDifficulty;
  }
  pauseToggledCallback(e: CustomEvent) {
    console.log("toggle paused received");
    if (e.detail.paused) {
      this.setPausedVisibility("block");
    } else {
      this.setPausedVisibility("none");
    }
  }
  highScoreCallback() {
    this.setHighScoreVisibility("block");
  }

  newGame() {
    // start new game using this.engine.gameLoop(0)
    this.hideInstructions("none");
    this.setGameOverVisibility("none");
    this.setHighScoreVisibility("none");
    this.showScore();
    this.score = 0;
    this.engine = new GameEngine(this.difficulty);
    this.engine.gameLoop(0);
    document.body.style.cursor = "none";
    this.hideMouseAfterIdle();
  }

  // short delay to avoid mouse reappearing if hand bumps mouse while clicking
  hideMouseAfterIdle() {
    setTimeout(
      () => window.addEventListener("mousemove", this.boundMouseMoveCallback),
      500
    );
  }

  /**
   *  disables mouse hiding feature. called after game over event
   */
  disableHideMouseAfterIdle() {
    window.clearTimeout(this.hideCursorTimeoutId); // remove hide cursor timer
    window.removeEventListener("mousemove", this.boundMouseMoveCallback);
  }

  /**
   * event listener passed to document.onmousemove to display the mouse again if moved, but hide
   * again if idle for 2 seconds
   */
  mouseMoveEventListener() {
    // don't want to fire a bunch of the same event
    window.removeEventListener("mousemove", this.boundMouseMoveCallback);
    // function to be called after 2 seconds of idle mouse
    const hideCursor = () => {
      window.clearTimeout(this.hideCursorTimeoutId); // don't want timer to keep going off after cursor hidden
      document.body.style.cursor = "none";
      window.addEventListener("mousemove", this.boundMouseMoveCallback); // listen for mouse move again
    };
    // show the mouse and start timer to hide again after 2 seconds
    document.body.style.cursor = "default";
    this.hideCursorTimeoutId = window.setTimeout(hideCursor, 2000);
  }

  /**
   * event handler that responds to Game Over event. sets UI elements to visible again and broadcasts
   * new high score event if applicable
   */
  gameOver() {
    document.body.style.cursor = "default";
    this.disableHideMouseAfterIdle();

    // set new high score if applicable and notify nav bar of new high score
    if (this.score > Number(localStorage.getItem(HIGH_SCORE))) {
      localStorage.setItem(HIGH_SCORE, this.score.toString());
      broadcastGameUpdate(NEW_HIGH_SCORE);
      this.setNewGameVisibility("block");
    } else {
      this.setGameOverVisibility("block");
    }

    delete this.engine;
  }

  setGameOverVisibility(value: string) {
    let gameOverText = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("game-over-text");
    gameOverText!.style.display = value;
    this.setNewGameVisibility(value);
  }

  setNewGameVisibility(value: string) {
    let newGameButton = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("new-game-button");
    newGameButton!.style.display = value;
    newGameButton!.innerText = "New Game";
  }

  setPausedVisibility(value: string) {
    let gameOverText = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("paused-text");
    gameOverText!.style.display = value;
  }

  setHighScoreVisibility(value: string) {
    let highScoreComponent = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("new-high-score");
    highScoreComponent!.style.display = value;
  }

  hideInstructions(value: string) {
    let instructions = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("instructions");
    instructions!.style.display = value;
  }

  /**
   * Sets score display to block
   */
  showScore() {
    let score = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("score");
    score!.style.display = "block";
  }

  protected render(): TemplateResult {
    return html`
      <div class="game-over-container">
        <high-score-wavy
          id="new-high-score"
          class="new-high-score"
        ></high-score-wavy>
        <div id="game-over-text" class="game-over-text">
          <h2>Game Over!</h2>
        </div>
        <div id="paused-text" class="paused-text">
          <h2>Paused</h2>
        </div>
      </div>
      <instructions-component
        id="instructions"
        class="instructions"
      ></instructions-component>
      <canvas
        id="snakeCanvas"
        class="canvas"
        width=${BLOCK_SIZE * MAP_SIZE}
        height=${BLOCK_SIZE * MAP_SIZE}
      ></canvas>
      <div class="button-container">
        <button
          id="new-game-button"
          class="new-game-button"
          @click=${this.newGame}
        >
          Start Game
        </button>
      </div>
      <div class="score-container">
        <h3 class="score" id="score">Score: ${this.score}</h3>
      </div>
    `;
  }
  // protected createRenderRoot() {
  //   return this;
  // }
}
