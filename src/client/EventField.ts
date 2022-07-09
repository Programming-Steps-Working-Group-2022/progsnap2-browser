import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { EVENT_TIME_FIELDS, ProgSnap2Event } from '../types';
import { diffSpans } from '../transform';
import LitElementNoShadow from './LitElementNoShadow';

@customElement('event-field')
class EventField extends LitElementNoShadow {
  @property({ type: Object })
  event?: ProgSnap2Event = undefined;

  @property({ type: Object })
  previous?: ProgSnap2Event = undefined;

  @property({ type: String })
  field = '';

  @property({ type: Boolean })
  code? = false;

  render(): TemplateResult {
    if (this.event !== undefined) {
      const val = this.event[this.field];
      if (val !== undefined) {
        if (this.field === 'X-CodeState') {
          const p = this.previous && this.previous[this.field];
          if (this.code) {
            return html`<source-code .src=${val} .diff=${p}></source-code>`;
          }
          return html`<pre>${unsafeHTML(diffSpans(val, p))}</pre>`;
        }
        if (EVENT_TIME_FIELDS.includes(this.field) && typeof val === 'number') {
          return html`<pre>${new Date(val).toLocaleString()}</pre>`;
        }
        return html`<pre>${val}</pre>`;
      }
    }
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'event-field': EventField;
  }
}

export default EventField;
