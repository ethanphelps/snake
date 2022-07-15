import {
  LitElement, html, TemplateResult, 
} from 'lit';
import { property, customElement } from 'lit/decorators.js';
import layoutStyles from './layout.component.sass'


@customElement('layout-component')
export class Layout extends LitElement {
  static styles = [layoutStyles]

  render(): TemplateResult {
    return html`
      <section class="layout-container">
        <navbar-component class="header"></navbar-component>
        <section class="main-container">
          <div class="game-container">
            <game-component id="game-component" class="game"></game-component>
          </div>
        </section>
        <section class="footer-container">
         <a href="https://github.com/ethanphelps/snake">
         <img src="src/assets/images/GitHub-Mark-Light-64px.png" alt="github logo"  class="github-logo"> 
         <!-- <img src="../../assets/images/GitHub-Mark-Light-64px.png" alt="github logo"  class="github-logo">  -->
         <p class="made-by">made by ethan phelps</p> 
        </a> 
        </section>
      </section>
    `
  }
}