import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  DEFAULT_LATENCY_THRESHOLD,
  EVENT_TIME_FIELDS,
  FieldRule,
  RULE_COLLAPSE_MODES,
} from '../types';

@customElement('field-rules')
class FieldRules extends LitElement {
  @property({ type: Array })
  rules: FieldRule[] = [];

  @property({ type: Number })
  rowStep = 0;

  @property({ type: Number })
  rowCount = 0;

  render(): TemplateResult {
    const selectValue = (select: HTMLSelectElement): string =>
      select.options[select.selectedIndex].value;
    const numberValue = (input: HTMLInputElement): number =>
      parseFloat(input.value);

    return html`
      <ul>
        ${this.rules.map(
          r => html`
            <li>
              <button @click=${() => this.deleteRule(r.field)}>x</button>
              ${r.field}
              <select
                @change=${(e: Event) =>
                  this.editRule({
                    ...r,
                    collapse: selectValue(e.target as HTMLSelectElement),
                  })}
              >
                ${(EVENT_TIME_FIELDS.includes(r.field)
                  ? RULE_COLLAPSE_MODES
                  : RULE_COLLAPSE_MODES.filter(m => m.id !== 'time')
                ).map(
                  mode => html`
                    <option
                      value=${mode.id}
                      .selected=${r.collapse === mode.id}
                    >
                      ${mode.label}
                    </option>
                  `,
                )}
              </select>
              ${r.collapse === 'time'
                ? html`<input
                      type="number"
                      step="0.1"
                      min="0.1"
                      .value=${(
                        r.latency || DEFAULT_LATENCY_THRESHOLD
                      ).toString()}
                      @change=${(e: Event) =>
                        this.editRule({
                          ...r,
                          latency: numberValue(e.target as HTMLInputElement),
                        })}
                    />
                    seconds`
                : html``}
            </li>
          `,
        )}
        <li>Row ${this.rowStep + 1} / ${this.rowCount}</li>
      </ul>
    `;
  }

  deleteRule(field: string): void {
    this.dispatchEvent(new CustomEvent('delete-rule', { detail: { field } }));
  }

  editRule(rule: FieldRule): void {
    this.dispatchEvent(new CustomEvent('edit-rule', { detail: { rule } }));
  }

  static styles = css`
    ul {
      margin: 0;
      padding: 5px;
      background-color: lightcyan;
      border-bottom: 1px solid grey;
    }
    ul li {
      margin-bottom: 5px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'field-rules': FieldRules;
  }
}

export default FieldRules;
