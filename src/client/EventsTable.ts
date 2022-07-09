import { html, PropertyValueMap, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import { EVENT_TIME_FIELDS, PrimitiveFields, ProgSnap2Event } from '../types';
import { intervalString } from '../transform';

@customElement('events-table')
class EventsTable extends LitElementNoShadow {
  @property({ type: Array })
  fields: string[] = [];

  @property({ type: Array })
  ruleFields: string[] = [];

  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @property({ type: Number })
  step = 0;

  @property({ type: Array })
  insertFields: string[] = [];

  @property({ type: Object })
  inserted: { [id: string]: PrimitiveFields } = {};

  @property({ type: Boolean })
  copy = false;

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
                    ${this.copy
                      ? ''
                      : html`
                          <button
                            class=${this.ruleFields.includes(field)
                              ? 'active'
                              : ''}
                            @click=${() =>
                              this.dispatchEvent(
                                new CustomEvent('add-rule', {
                                  detail: { field },
                                }),
                              )}
                          >
                            ⚙
                          </button>
                        `}
                  </th>
                  ${EVENT_TIME_FIELDS.includes(field)
                    ? html`<th>Delay</th>`
                    : ''}
                `,
              )}
              ${this.insertFields.map(f => html`<th>${f}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${this.events.map((e, i) => {
              const p = i > 0 ? this.events[i - 1] : undefined;
              return html`
                <tr class=${!this.copy && i === this.step ? 'current' : ''}>
                  ${this.fields.map(
                    f =>
                      html`<td>
                          <event-field
                            .event=${e}
                            .previous=${p}
                            .field=${f}
                          ></event-field>
                        </td>
                        ${EVENT_TIME_FIELDS.includes(f)
                          ? html`<td>
                              <pre>
${intervalString(e[f], p !== undefined && p[f])}</pre
                              >
                            </td>`
                          : ''}`,
                  )}
                  ${this.insertFields.map(f => {
                    const v = (this.inserted[e.EventID] || {})[f];
                    return this.copy
                      ? html`<td><pre>${v}</pre></td>`
                      : html`<td>
                          <input
                            type="text"
                            .value=${v?.toString() || ''}
                            @change=${(evt: Event) =>
                              this.insertValue(
                                e.EventID,
                                f,
                                (evt.target as HTMLInputElement).value,
                              )}
                          />
                        </td>`;
                  })}
                </tr>
              `;
            })}
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

  insertValue(id: string, field: string, value: string): void {
    console.log('insert');
    this.dispatchEvent(
      new CustomEvent('insert-value', {
        detail: { id, field, value },
        bubbles: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'events-table': EventsTable;
  }
}

export default EventsTable;
