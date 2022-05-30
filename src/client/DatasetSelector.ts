import { html, TemplateResult } from 'lit';
/* eslint-disable import/extensions */
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import LitElementNoShadow from './LitElementNoShadow';
import { Dataset } from '../types';
import './styles.css';

@customElement('dataset-selector')
class DatasetSelector extends LitElementNoShadow {
  @property()
  apiUrl?: string = undefined;

  @state()
  private datasets?: Dataset[] = undefined;

  @state()
  private selected?: string = undefined;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.fetchDatasetMeta();
    this.parseURI();
    window.onpopstate = () => {
      this.parseURI();
    };
  }

  protected parseURI() {
    const match = window.location.href.match(/(#[\w-]+)?$/);
    if (match !== null) {
      this.selected = match[0].substring(1);
    }
  }

  render(): TemplateResult {
    if (!this.apiUrl) {
      return html`<div class="error">Missing required attributes</div>`;
    }
    if (this.datasets === undefined) {
      return html`<div class="loader">Loading dataset meta...</div>`;
    }
    if (this.selected) {
      return html`<events-browser
        .apiUrl=${this.apiUrl}
        .ds=${this.selected}
        @pick-dataset=${() => this.selectDataset(undefined)}
      ></events-browser>`;
    }
    return html`
      <section>
        <h1>progsnap2-browser</h1>
        <p>The available datasets:</p>
      </section>
      <ul class="dataset-list">
        ${this.datasets.map(
          ds => html`
            <li @click=${() => this.selectDataset(ds)}>
              <h2>${ds.id}</h2>
              <p>${unsafeHTML(ds.description)}</p>
            </li>
          `,
        )}
      </ul>
    `;
  }

  protected selectDataset(ds?: Dataset) {
    if (ds !== undefined) {
      window.history.pushState({}, '', `#${ds.id}`);
    } else {
      window.history.pushState({}, '', './');
    }
    this.selected = ds?.id;
  }

  protected async fetchDatasetMeta() {
    const response = await window.fetch(`${this.apiUrl}ds/`);
    this.datasets = await response.json();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dataset-selector': DatasetSelector;
  }
}

export default DatasetSelector;
