import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ProgSnap2Event } from '../types';
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
        if (
          typeof val === 'number' &&
          ['ClientTimestamp', 'ServerTimestamp'].includes(this.field)
        ) {
          if (this.previous) {
            const p = this.previous[this.field];
            if (typeof p === 'number') {
              const d = (val - p) / 1000;
              if (d < 3600) {
                return html`${new Date(val).toLocaleString()} is
                ${Math.floor(d / 60)
                  .toString()
                  .padStart(2, '0')}:${Math.round(d % 60)
                  .toString()
                  .padStart(2, '0')}
                later`;
              }
            }
          }
          return html`${new Date(val).toLocaleString()}`;
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
