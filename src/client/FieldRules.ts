import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { getSelectElementValue } from './dom';

export interface FieldRule {
  name: string;
  collapse: string;
  latency?: number;
}

export const DEFAULT_LATENCY = 5.0;

const COLLAPSE_MODES = [
  { id: 'none', label: 'No rule' },
  { id: 'time', label: 'Collapse while step latency below threshold' },
  { id: 'unchanged', label: 'Collapse while unchanged' },
  { id: 'empty', label: 'Collapse while empty' },
  { id: 'empty_or_unchanged', label: 'Collapse while unchanged or empty' },
];

const TIME_FIELDS = ['ServerTimestamp', 'ClientTimestamp'];

@customElement('field-rules')
class FieldRules extends LitElement {
  @property({ type: Array })
  rules: FieldRule[] = [];

  render(): TemplateResult {
    if (this.rules.length === 0) {
      return html``;
    }
    return html`
      <ul>
        ${this.rules.map(
          r => html`
            <li>
              <button @click=${() => this.deleteRule(r.name)}>x</button>
              ${r.name}
              <select
                @change=${(e: Event) =>
                  this.editRule({
                    ...r,
                    collapse: getSelectElementValue(
                      e.target as HTMLSelectElement,
                    ),
                  })}
              >
                ${(TIME_FIELDS.includes(r.name)
                  ? COLLAPSE_MODES
                  : COLLAPSE_MODES.filter(m => m.id !== 'time')
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
                      .value=${(r.latency || DEFAULT_LATENCY).toString()}
                      @change=${(e: Event) =>
                        this.editRule({
                          ...r,
                          latency: parseFloat(
                            (e.target as HTMLInputElement).value,
                          ),
                        })}
                    />
                    seconds`
                : html``}
            </li>
          `,
        )}
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
