import { LitElement, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { DIFFICULTY_CHANGED } from "../../config/constants";
import { broadcastGameUpdate } from "../../utils/utils";
import styles from "./toggle-buttons.component.sass";

@customElement("toggle-buttons")
export class ToggleButtons extends LitElement {
  static styles = [styles];

  /**
   * Loops through all the buttons with class .difficulty-button and toggles the active class.
   * This "unpresses" the previously pressed button. Then, button just pressed is set to active.
   * @param e a click event dispatched when one of the toggle buttons is clicked
   */
  togglePressed(e: Event) {
    // get all buttons with .difficulty-button class
    const buttons = document
      .getElementById("root")
      ?.shadowRoot?.querySelector("navbar-component")
      ?.shadowRoot?.querySelector("toggle-buttons")
      ?.shadowRoot?.querySelectorAll(".difficulty-button");
    // "unpress" other buttons once new button pressed
    buttons?.forEach((b) => {
      if (b.classList.contains("active")) {
        b.classList.toggle("active");
      }
    });
    // add 'active' class to newly pressed button
    const element = e.target as HTMLElement;
    element.classList.toggle("active");
    // dispatch event to tell game engine what new difficulty should be
    broadcastGameUpdate(DIFFICULTY_CHANGED, { newDifficulty: element.id });
  }

  render(): TemplateResult {
    return html`
      <div class="difficulty-container">
        <h5>Mode:</h5>
        <button
          @click=${this.togglePressed}
          id="easy"
          class="difficulty-button active"
        >
          Easy
        </button>
        <button
          @click=${this.togglePressed}
          id="medium"
          class="difficulty-button"
        >
          Medium
        </button>
        <button
          @click=${this.togglePressed}
          id="hard"
          class="difficulty-button"
        >
          Hard
        </button>
      </div>
    `;
  }
}
