import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import styles from './high-score.component.scss'

@customElement('high-score-component')
export class HighScore extends LitElement {
  static styles = [styles]

  render(): TemplateResult {
    return html`
      <div class="container">
        <h1>
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
          <span>HIGH SCORE</span> 
        </h1>
      </div>
    `
  }
}