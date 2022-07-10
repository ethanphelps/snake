import { customElement, property } from "lit/decorators.js";
import { LitElement, html, TemplateResult } from "lit";
import { NEW_HIGH_SCORE, HIGH_SCORE } from "../../../config/constants";
import styles from "./navbar.component.sass";

@customElement("navbar-component")
export class NavBar extends LitElement {
  static styles = [styles];

  @property()
  highScore: number = 0;

  constructor() {
    super();
    // set high score
    let previousHighScore = localStorage.getItem(HIGH_SCORE);
    if (previousHighScore) {
      this.highScore = Number(previousHighScore);
    }
    // add event listener for new high score
    window.addEventListener(NEW_HIGH_SCORE, (e: Event) => {
      if (e instanceof CustomEvent) {
        this.setHighScore();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(NEW_HIGH_SCORE, () =>
      this.setHighScore.bind(this)
    );
  }

  setHighScore() {
    console.log("new high score!!");
    let previousHighScore = localStorage.getItem(HIGH_SCORE);
    this.highScore = previousHighScore ? Number(previousHighScore) : 0;
  }

  render(): TemplateResult {
    return html`
      <nav class="navbar">
        <toggle-buttons></toggle-buttons>
        <h4 class="high-score">High Score: ${this.highScore}</h4>
        <p>SNAKE</p>
      </nav>
    `;
  }
}
