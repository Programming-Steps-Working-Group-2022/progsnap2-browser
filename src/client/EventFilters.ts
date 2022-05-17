import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { getSelectElementValue } from './dom';
import { EVENT_FILTER_FIELDS, EventFilterOptions } from '../types';

@customElement('event-filters')
class EventFilters extends LitElement {
  @property({ type: Object, reflect: true })
  filters?: EventFilterOptions = undefined;

  render(): TemplateResult {
    return this.filters === undefined
      ? html`<div>Loading filter options...</div>`
      : html`
          <ul class="filters">
            ${EVENT_FILTER_FIELDS.map(f => {
              const options = (this.filters || {})[f];
              return options !== undefined
                ? html`
                    <li>
                      ${f}
                      <select
                        @change=${(e: Event) =>
                          this.select(f, e.target as HTMLSelectElement)}
                      >
                        ${options.map(o => html`<option>${o}</option>`)}
                      </select>
                    </li>
                  `
                : undefined;
            })}
          </ul>
        `;
  }

  select(field: string, select: HTMLSelectElement) {
    this.dispatchEvent(
      new CustomEvent('select-filter', {
        detail: { field, value: getSelectElementValue(select) },
      }),
    );
  }

  static styles = css`
    ul {
      margin: 0 0 5px 0;
      padding: 5px;
      border-bottom: 1px solid grey;
      background-color: lightgrey;
    }
    ul li {
      display: inline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'event-filters': EventFilters;
  }
}

export default EventFilters;
