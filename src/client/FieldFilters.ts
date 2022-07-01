import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('field-filters')
class FieldFilters extends LitElement {
  @property({ type: Array })
  fields?: string[] = undefined;

  @property({ type: Array })
  display?: string[] = undefined;

  render(): TemplateResult {
    if (this.fields === undefined || this.display === undefined) {
      return html``;
    }
    return html`
      <ul>
        <li>
          <button @click=${() => this.updateDisplay(undefined)}>
            Show all
          </button>
        </li>
        ${this.fields.map(
          f => html`
            <li>
              <label>
                <input
                  type="checkbox"
                  .checked=${(this.display || []).includes(f)}
                  @change=${() => this.toggleDisplay(f)}
                />
                ${f}
              </label>
            </li>
          `,
        )}
      </ul>
    `;
  }

  toggleDisplay(field: string): void {
    if (this.display?.includes(field)) {
      this.updateDisplay(this.display?.filter(f => f !== field));
    } else {
      this.updateDisplay(
        this.fields?.filter(f => f === field || this.display?.includes(f)),
      );
    }
  }

  updateDisplay(fields?: string[]): void {
    this.dispatchEvent(
      new CustomEvent('select-display', { detail: { fields } }),
    );
  }

  static styles = css`
    ul {
      margin: 0;
      padding: 5px;
      border-bottom: 1px solid grey;
    }
    ul li {
      display: inline;
      white-space: nowrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'field-filters': FieldFilters;
  }
}

export default FieldFilters;
