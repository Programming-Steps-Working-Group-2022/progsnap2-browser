import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import {
  EVENT_FILTER_FIELDS,
  EventFilterOptions,
  ProgSnap2Event,
} from '../types';

@customElement('events-browser')
class EventsBrowser extends LitElementNoShadow {
  @property()
  filtersUrl?: string = undefined;

  @property()
  eventsUrl?: string = undefined;

  @state()
  private filters?: EventFilterOptions = undefined;

  @state()
  private selection?: EventFilterOptions = undefined;

  @state()
  private events: ProgSnap2Event[] = [];

  @state()
  private index = 0;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    if (this.filtersUrl) {
      const response = await window.fetch(this.filtersUrl);
      this.filters = await response.json();
      this.selection = Object.fromEntries(
        EVENT_FILTER_FIELDS.map(f => {
          const options = (this.filters || {})[f];
          return [f, options !== undefined ? options[0] : undefined];
        }),
      );
      this.fetchEvents();
    }
  }

  render(): TemplateResult {
    if (!this.filtersUrl || !this.eventsUrl) {
      return html`<div>Element misses required attributes</div>`;
    }
    return html`
      <event-filters
        .filters=${this.filters}
        @select-filter=${this.selectFilter}
      ></event-filters>
      <events-view
        .events=${this.events}
        .index=${this.index}
        @set-index=${(e: CustomEvent) => {
          this.index = e.detail.index;
        }}
      ></events-view>
    `;
  }

  async selectFilter(event: CustomEvent): Promise<void> {
    this.selection = {
      ...this.selection,
      ...Object.fromEntries([[event.detail.field, [event.detail.value]]]),
    };
    this.fetchEvents();
  }

  async fetchEvents() {
    if (this.eventsUrl) {
      const response = await window.fetch(this.eventsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.selection),
      });
      this.events = await response.json();
      this.index = 0;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'events-browser': EventsBrowser;
  }
}

export default EventsBrowser;
