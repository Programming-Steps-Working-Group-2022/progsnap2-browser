import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { ProgSnap2Event } from '../types';
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
        if (this.code && this.field === 'X-CodeState') {
          return html`<source-code .src=${val}></source-code>`;
        }
        if (
          typeof val === 'number' &&
          ['ClientTimestamp', 'ServerTimestamp'].includes(this.field)
        ) {
          if (this.previous) {
            const p = this.previous[this.field];
            if (typeof p === 'number') {
              const d = (val - p) / 1000;
              return html`${new Date(val).toLocaleString()} is
              ${Math.floor(d / 60)
                .toString()
                .padStart(2, '0')}:${Math.round(d % 60)
                .toString()
                .padStart(2, '0')}
              later`;
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
