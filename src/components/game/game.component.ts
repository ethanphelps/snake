import {
  LitElement, html, TemplateResult, 
} from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BLOCK_SIZE, MAP_SIZE } from '../../config/constants';
import gameStyles from './game.component.sass'
import { GameEngine } from './classes/engine';

@customElement('game-component')
export class SnakeGame extends LitElement {
  static styles = [gameStyles]
  engine: GameEngine = {} as GameEngine; // engine and state stored locally, but later state will be stored remotely

  firstUpdated() {
    // instantiate the game engine AFTER the page loads so the canvas isn't null
    super.connectedCallback()
    window.addEventListener('load', () => this.engine = new GameEngine())
  }
  disconnectedCallback() {
    super.connectedCallback()
    window.removeEventListener('load', () => this.engine = new GameEngine())
  }
  

  protected render(): TemplateResult {
      return html`
        <canvas id="snakeCanvas" class="canvas" width=${BLOCK_SIZE * MAP_SIZE} height=${BLOCK_SIZE * MAP_SIZE}></canvas>
      `
  }
  // protected createRenderRoot() {
  //   return this;
  // }
}