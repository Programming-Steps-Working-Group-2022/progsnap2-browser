import { html, PropertyValueMap, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import { ProgSnap2Event } from '../types';
import './styles.css';

@customElement('events-table')
class EventsTable extends LitElementNoShadow {
  @property({ type: Array })
  fields: string[] = [];

  @property({ type: Array })
  ruleFields: string[] = [];

  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @property({ type: Number })
  index = 0;

  render(): TemplateResult {
    return html`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${this.fields.map(
                field => html`
                  <th>
                    <strong
                      @click=${() =>
                        this.dispatchEvent(
                          new CustomEvent('focus-display', {
                            detail: { field },
                          }),
                        )}
                      >${field}</strong
                    >
                    <button
                      class=${this.ruleFields.includes(field) ? 'active' : ''}
                      @click=${() =>
                        this.dispatchEvent(
                          new CustomEvent('add-rule', { detail: { field } }),
                        )}
                    >
                      ⚙
                    </button>
                  </th>
                `,
              )}
            </tr>
          </thead>
          <tbody>
            ${this.events.map(
              (e, i) => html`
                <tr class=${i === this.index ? 'current' : ''}>
                  ${this.fields.map(
                    f =>
                      html`<td>
                        <event-field .event=${e} .field=${f}></event-field>
                      </td>`,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected updated(changed: PropertyValueMap<unknown>): void {
    if ([...changed.keys()].includes('index')) {
      setTimeout(
        () =>
          document
            .querySelector('tr.current')
            ?.scrollIntoView({ block: 'center' }),
        100,
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'events-table': EventsTable;
  }
}

export default EventsTable;
