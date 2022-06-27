import {
  LitElement, html, TemplateResult, 
} from 'lit';
import { property, customElement } from 'lit/decorators.js';
import gameStyles from './game.component.sass'

@customElement('game-component')
export class SnakeGame extends LitElement {
  static styles = [gameStyles]

  protected render(): TemplateResult {
      return html`

      `
  }
}