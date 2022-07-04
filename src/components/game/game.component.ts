import { LitElement, html, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";
import { BLOCK_SIZE, MAP_SIZE } from "../../config/constants";
import gameStyles from "./game.component.sass";
import { GameEngine } from "./classes/engine";

@customElement("game-component")
export class SnakeGame extends LitElement {
  static styles = [gameStyles];
  engine: GameEngine = {} as GameEngine; // engine and state stored locally, but later state will be stored remotely

  constructor() {
    super()
    window.addEventListener('game-over', (e: Event) => {
      if(e instanceof CustomEvent) { // doing this to suppress ts type errors
        this.gameOver(e)
      }
    });
    window.addEventListener('new-game', (e: Event) => {
      if(e instanceof CustomEvent) {
        this.newGame(e)
      }
    });
  }


  firstUpdated() {
    // instantiate the game engine AFTER the page loads so the canvas isn't null
    // super.firstUpdated();
    window.addEventListener("load", () => (this.engine = new GameEngine()));
  }


  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("load", () => (this.engine = new GameEngine()));
    window.removeEventListener("game-over", () => this.gameOver.bind(this));
    window.removeEventListener("new-game", () => this.newGame.bind(this));
  }


  newGame(e: Event) {
    // start new game using this.engine.gameLoop(0)
    console.log('new game button clicked!!')
    this.setGameOverVisibility('none')
    this.engine = new GameEngine()
    this.engine.gameLoop(0)
  }


  gameOver(e: CustomEvent) {
    // do something like change styles, show a dialog/button for starting a new game
    console.log(e)
    console.log("game over event received in game component!!");
    this.setGameOverVisibility('block')
  }


  setGameOverVisibility(value: string) {
    let gameOverText = document.getElementById('root')?.shadowRoot?.getElementById('game-component')?.shadowRoot?.getElementById('game-over-text')
    let newGameButton = document.getElementById('root')?.shadowRoot?.getElementById('game-component')?.shadowRoot?.getElementById('new-game-button')
    gameOverText!.style.display = value 
    newGameButton!.style.display = value 
    newGameButton!.innerText = 'New Game'
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
        <button id="new-game-button" class="new-game-button" @click=${this.newGame}>Start Game</button>
      </div>
    `;
  }
  // protected createRenderRoot() {
  //   return this;
  // }
}
