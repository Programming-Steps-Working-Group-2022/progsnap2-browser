import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
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
              <p>${ds.description}</p>
            </li>
          `,
        )}
      </ul>
    `;
  }

  protected selectDataset(ds: Dataset) {
    // window.history.pushState({}, '', `${ds.id}/`);
    this.selected = ds.id;
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
