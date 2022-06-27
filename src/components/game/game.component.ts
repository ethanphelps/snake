import {
  LitElement, html, TemplateResult, 
} from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BLOCK_SIZE, MAP_SIZE } from '../config/constants';
import gameStyles from './game.component.sass'

@customElement('game-component')
export class SnakeGame extends LitElement {
  static styles = [gameStyles]

  protected render(): TemplateResult {
      return html`
        <canvas id="snakeCanvas" class="canvas" width=${BLOCK_SIZE * MAP_SIZE} height=${BLOCK_SIZE * MAP_SIZE}></canvas>
      `
  }
}