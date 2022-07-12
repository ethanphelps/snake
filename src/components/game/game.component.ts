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
} from "../../config/constants";
import {
  broadcastGameUpdate,
  listenFor,
  removeCustomListener,
} from "../../utils/utils";
import gameStyles from "./game.component.sass";
import { GameEngine } from "./classes/engine";
import { Difficulty } from "../../models/enums";

@customElement("game-component")
export class SnakeGame extends LitElement {
  static styles = [gameStyles];
  engine?: GameEngine = {} as GameEngine; // engine and state stored locally, but later state will be stored remotely
  hideCursorTimeoutId: number | undefined;
  difficulty: Difficulty = Difficulty.easy;

  @property()
  score: number = 0; // declared as property so score gets rerendered when its value changes

  constructor() {
    super();
    if (!localStorage.getItem(HIGH_SCORE)) {
      localStorage.setItem(HIGH_SCORE, "0"); // set high score to zero if first time loading game
    }
    // add event listeners
    listenFor(GAME_OVER, () => this.gameOver());
    listenFor(NEW_GAME, () => this.newGame());
    listenFor(SCORE_INCREASED, () => this.score++);
    listenFor(
      DIFFICULTY_CHANGED,
      (e: CustomEvent) => (this.difficulty = e.detail.newDifficulty)
    );
  }

  firstUpdated() {
    // instantiate the game engine AFTER the page loads so the canvas isn't null
    // window.addEventListener("load", () => (this.engine = new GameEngine()));
  }

  /**
   * This function has references to this.engine, which could be causing the old engines to not be garbage collected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    // window.removeEventListener("load", () => (this.engine = new GameEngine()));
    // window.removeEventListener(GAME_OVER, () => this.gameOver.bind(this));
    // window.removeEventListener(NEW_GAME, () => this.newGame.bind(this));
    window.removeEventListener(SCORE_INCREASED, () => this.score++); // does this actually remove the event?
    removeCustomListener(
      DIFFICULTY_CHANGED,
      (e: CustomEvent) => (this.difficulty = e.detail.newDifficulty)
    );
  }

  newGame() {
    // start new game using this.engine.gameLoop(0)
    this.setGameOverVisibility("none");
    this.showScore();
    this.score = 0;
    this.engine = new GameEngine(this.difficulty);
    this.engine.gameLoop(0);
    document.body.style.cursor = "none";
    this.hideMouseAfterIdle();
  }

  hideMouseAfterIdle() {
    // short delay to avoid mouse reappearing if hand bumps mouse while clicking
    setTimeout(() => (document.onmousemove = this.mouseMoveEventListener), 500);
  }

  disableHideMouseAfterIdle() {
    window.clearTimeout(this.hideCursorTimeoutId); // remove hide cursor timer
    document.onmousemove = null;
  }

  mouseMoveEventListener() {
    // function to be called after 2 seconds of idle mouse
    const hideCursor = () => {
      window.clearTimeout(this.hideCursorTimeoutId); // don't want timer to keep going off after cursor hidden
      document.body.style.cursor = "none";
    };
    document.body.style.cursor = "default";
    this.hideCursorTimeoutId = window.setTimeout(hideCursor, 2000); // hide after 3 seconds idle
  }

  gameOver() {
    this.setGameOverVisibility("block");
    document.body.style.cursor = "default";
    this.disableHideMouseAfterIdle();

    // set new high score if applicable
    if (this.score > Number(localStorage.getItem(HIGH_SCORE))) {
      localStorage.setItem(HIGH_SCORE, this.score.toString());
      // notify nav bar of new high score
      broadcastGameUpdate(NEW_HIGH_SCORE);
    }

    delete this.engine
  }

  setGameOverVisibility(value: string) {
    let gameOverText = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("game-over-text");
    let newGameButton = document
      .getElementById("root")
      ?.shadowRoot?.getElementById("game-component")
      ?.shadowRoot?.getElementById("new-game-button");
    gameOverText!.style.display = value;
    newGameButton!.style.display = value;
    newGameButton!.innerText = "New Game";
  }

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
        <div id="game-over-text" class="game-over-text">
          <h2>Game Over!</h2>
        </div>
      </div>
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
