import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import filterSelection from './filterSelection';
import modifierSelection, { Modifiers } from './modifierSelection';
import eventTimeline from './eventTimeline';
import {
  EVENT_FILTER_FIELDS,
  EventFilterOptions,
  PrimitiveValues,
  ProgSnap2Event,
} from '../types';

@customElement('events-browser')
class EventsBrowser extends LitElement {
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
  private modifiers: Modifiers = {
    codeStateOnly: false,
    collapseSteps: false,
    maxLatency: 10,
    maxCharacters: 10,
  };

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

  async makeSelection(
    fieldName: string,
    value: PrimitiveValues,
  ): Promise<void> {
    this.selection = {
      ...this.selection,
      ...Object.fromEntries([[fieldName, value]]),
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
      this.requestUpdate();
    }
  }

  setModifiers(modifiers: Modifiers) {
    this.modifiers = modifiers;
    this.requestUpdate();
  }

  render(): TemplateResult {
    if (!this.filtersUrl || !this.eventsUrl) {
      return html`
        <div class="error">
          Missing required attributes: filtersUrl & eventsUrl
        </div>
      `;
    }
    return html`
      ${filterSelection(this.makeSelection.bind(this), this.filters)}
      ${modifierSelection(this.setModifiers.bind(this), this.modifiers)}
      ${eventTimeline(this.events, this.modifiers)}
    `;
  }

  static styles = css`
    ul.filters {
      margin: 0 0 5px 0;
      padding: 5px;
      border-bottom: 1px solid grey;
      background-color: lightgrey;
    }
    ul.filters li {
      display: inline;
    }
    .modifiers input[type='number'] {
      width: 3em;
    }
    table.events {
      width: 100%;
      max-height: 600px;
      border: 2px solid grey;
      overflow: auto;
    }
    table.events th {
      position: sticky;
      top: 0;
    }
    table.events td {
      border: 1px solid lightgray;
    }
  `;
}

export default EventsBrowser;
