import { customElement } from "lit/decorators.js";
import { LitElement, html, TemplateResult } from "lit";
import styles from "./navbar.component.sass"

@customElement('navbar-component')
export class NavBar extends LitElement {
  static styles = [styles]
  
  render(): TemplateResult {
     return html`
      <nav class="navbar">
        <p>SNAKE</p>
      </nav>
     ` 
  }
} 