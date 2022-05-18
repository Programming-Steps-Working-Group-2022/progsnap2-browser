import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { ProgSnap2Event } from '../types';

@customElement('events-table')
class EventsTable extends LitElement {
  @property({ type: Array })
  fields: string[] = [];

  @property({ type: Array })
  ruleFields: string[] = [];

  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  render(): TemplateResult {
    return html`
      <div class="wrap">
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
              e => html`
                <tr>
                  ${this.fields.map(
                    f => html`<td><pre>${e[f || '']}</pre></td>`,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  static styles = css`
    .wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 5px;
      overflow: auto;
    }
    table {
      position: sticky;
      top: 0;
      width: 100%;
      border-collapse: collapse;
    }
    table th {
      position: sticky;
      top: 0;
      background-color: white;
      text-align: left;
      white-space: nowrap;
    }
    table th strong {
      text-decoration: underline;
      cursor: pointer;
    }
    table th button {
      font-weight: bold;
    }
    table th button.active {
      color: darkcyan;
    }
    table td {
      border: 1px solid lightgray;
      vertical-align: top;
    }
    table td pre {
      margin: 0;
      max-width: 50em;
      white-space: pre-wrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'events-table': EventsTable;
  }
}

export default EventsTable;
