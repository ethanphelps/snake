import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import styles from './instructions.component.sass'

@customElement('instructions-component')
export class Instructions extends LitElement {
  static styles = [styles]

  render(): TemplateResult {
    return html`
      <figure class="instructions-container">
        <!-- <h3>Instructions</h3> -->
        <p>Use the WASD keys to move around</p>
        <div class="wasd">
          <div class="W">W</div>
          <div class="A">A</div>
          <div class="S">S</div>
          <div class="D">D</div>
        </div>
        <p>Eat food to get points.</br> Don't hit yourself or the walls!</p>
        <p>Press the space bar at any time to pause</p>
      </figure>
    `
  }
}