import {
  LitElement, html, TemplateResult, 
} from 'lit';
import { property, customElement } from 'lit/decorators.js';
import layoutStyles from './layout.component.sass'

// custom elements require a hyphen in the name
@customElement('layout-component')
export class Layout extends LitElement {
  static styles = [layoutStyles]

  render(): TemplateResult {
    return html`
      <section class="layout-container">
        <navbar-component class="header"></navbar-component>
        <!-- <p>Hello from layout container!</p> -->
        <section class="main-container">
          <div class="game-container">
            <game-component class="game"></game-component>
          </div>
        </section>
        <section class="footer-container">
         footer text 
        </section>
      </section>
    `
  }
}