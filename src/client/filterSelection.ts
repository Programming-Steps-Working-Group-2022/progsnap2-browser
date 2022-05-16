import { TemplateResult, html } from 'lit';
import {
  EVENT_FILTER_FIELDS,
  EventFilterOptions,
  PrimitiveValues,
} from '../types';

const filterSelection = (
  select: (fieldName: string, value: PrimitiveValues) => void,
  filters?: EventFilterOptions,
): TemplateResult => {
  const onSelect = (fieldName: string, element: HTMLSelectElement) => {
    select(fieldName, element.options[element.selectedIndex].value);
  };

  return filters === undefined
    ? html`<div class="loader">Loading filter options...</div>`
    : html`
        <ul class="filters">
          ${EVENT_FILTER_FIELDS.map(f => {
            const options = filters[f];
            return options !== undefined
              ? html`
                  <li>
                    ${f}
                    <select
                      @change=${(e: Event) =>
                        onSelect(f, e.target as HTMLSelectElement)}
                    >
                      ${options.map(o => html`<option>${o}</option>`)}
                    </select>
                  </li>
                `
              : undefined;
          })}
        </ul>
      `;
};

export default filterSelection;
