import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import {
  EMPTY_INDEX,
  EventIndex,
  PrimitiveFields,
  PrimitiveValues,
} from '../types';
import { indexToOptions } from '../transform';

@customElement('event-filters')
class EventFilters extends LitElement {
  @property({ type: Object })
  index: EventIndex = EMPTY_INDEX();

  @property({ type: Object })
  selection?: PrimitiveFields = undefined;

  render(): TemplateResult {
    return html`
      <ul class="filters">
        <li>
          <button
            @click=${() =>
              this.dispatchEvent(
                new CustomEvent('pick-dataset', { bubbles: true }),
              )}
          >
            ◀ Datasets
          </button>
        </li>
        ${indexToOptions(this.index, this.selection || {}).map(
          ({ field, selected, options }) =>
            html`
              <li>
                ${field}
                <select
                  @change=${(e: Event) =>
                    this.select(field, options, e.target as HTMLSelectElement)}
                >
                  ${options.map(
                    o =>
                      html`<option .selected=${o.value === selected}>
                        ${o.value} ${o.size > 0 ? `(${o.size})` : ``}
                      </option>`,
                  )}
                </select>
              </li>
            `,
        )}
      </ul>
    `;
  }

  select(
    field: string,
    options: { value: PrimitiveValues; size: number }[],
    select: HTMLSelectElement,
  ) {
    this.dispatchEvent(
      new CustomEvent('select-filter', {
        detail: { field, value: options[select.selectedIndex].value },
      }),
    );
  }

  static styles = css`
    ul {
      margin: 0;
      padding: 5px;
      border-bottom: 1px solid grey;
      background-color: lightgrey;
    }
    ul li {
      display: inline;
      white-space: nowrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'event-filters': EventFilters;
  }
}

export default EventFilters;
