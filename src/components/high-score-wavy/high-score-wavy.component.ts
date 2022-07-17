import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./high-score-wavy.component.scss";

@customElement("high-score-wavy")
export class HighScoreWavy extends LitElement {
  static styles = [styles];

  // span for each letter so they can be animated individually
  highScore = html`
    <span class="layer">
      <span>H</span>
      <span>I</span>
      <span>G</span>
      <span class="end-word">H</span>
      <span>S</span>
      <span>C</span>
      <span>O</span>
      <span>R</span>
      <span>E</span>
    </span>`;

  render(): TemplateResult {
    return html`
      <div class="container">
        <h1>
          ${this.highScore}
          ${this.highScore}
          ${this.highScore}
          ${this.highScore} 
          ${this.highScore} 
          ${this.highScore}
        </h1>
      </div>
    `;
  }
}
