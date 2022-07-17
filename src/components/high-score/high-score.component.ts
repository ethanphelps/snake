import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import styles from './high-score.component.scss'

@customElement('high-score-component')
export class HighScore extends LitElement {
  static styles = [styles]

 highScore = html`
    <span class="layer">
      <!-- <span class="word"> -->
        <span>H</span>
        <span>I</span>
        <span>G</span>
        <span class="end-word">H</span>
      <!-- </span> -->
      <!-- <span class="word"> -->
        <span>S</span>
        <span>C</span>
        <span>O</span>
        <span>R</span>
        <span>E</span>
      <!-- </span> -->
    </span>`;

  render(): TemplateResult {
    return html`
      <div class="container">
        <h1>
          <!-- <span>HIGH SCORE</span>  -->
          ${this.highScore}
          ${this.highScore}
          ${this.highScore}
          ${this.highScore}
          ${this.highScore}
          ${this.highScore}
          <!-- <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span>  -->
        </h1>
      </div>
    `
  }
}