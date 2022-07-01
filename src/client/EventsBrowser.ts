import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import { EventIndex, PrimitiveFields, ProgSnap2Event } from '../types';
import { indexToOptions } from '../transform';

@customElement('events-browser')
class EventsBrowser extends LitElementNoShadow {
  @property()
  apiUrl?: string = undefined;

  @property()
  ds?: string = undefined;

  @state()
  private index?: EventIndex = undefined;

  @state()
  private selection?: PrimitiveFields = undefined;

  @state()
  private events?: ProgSnap2Event[] = undefined;

  @state()
  private step = 0;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.fetchIndex();
  }

  render(): TemplateResult {
    if (!this.apiUrl || !this.ds) {
      return html`<div class="error">Missing required attributes</div>`;
    }
    if (this.index === undefined || this.selection === undefined) {
      return html`<div class="loader">Loading index...</div>`;
    }
    return html`
      <event-filters
        .index=${this.index}
        .selection=${this.selection}
        @select-filter=${this.selectFilter}
      ></event-filters>
      <events-view
        .events=${this.events}
        .step=${this.step}
        @set-step=${(e: CustomEvent) => {
          this.step = e.detail.step;
        }}
      ></events-view>
    `;
  }

  async selectFilter(event: CustomEvent): Promise<void> {
    if (this.index !== undefined) {
      this.selection = Object.fromEntries(
        indexToOptions(this.index, {
          ...this.selection,
          ...Object.fromEntries([[event.detail.field, event.detail.value]]),
        }).map(o => [o.field, o.selected]),
      );
      this.fetchEvents();
    }
  }

  protected async fetchIndex() {
    const response = await window.fetch(`${this.apiUrl}ds/${this.ds}/index`);
    this.index = await response.json();
    if (this.index !== undefined) {
      this.selection = Object.fromEntries(
        indexToOptions(this.index, {}).map(o => [o.field, o.selected]),
      );
      this.fetchEvents();
    }
  }

  protected async fetchEvents() {
    this.events = undefined;
    const response = await window.fetch(`${this.apiUrl}ds/${this.ds}/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.selection),
    });
    this.events = await response.json();
    this.step = 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'events-browser': EventsBrowser;
  }
}

export default EventsBrowser;
