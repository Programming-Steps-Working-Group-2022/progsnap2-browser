import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { pickExistingFrom, collapseRows } from './operations';
import { ProgSnap2Event } from '../types';
import { FieldRule } from './FieldRules';

@customElement('event-timeline')
class EventTimeline extends LitElement {
  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @state()
  fieldRules: FieldRule[] = [];

  @state()
  displayFields?: string[] = undefined;

  render(): TemplateResult {
    if (!this.events.length) {
      return html`<div>No events available</div>`;
    }
    const allFields = Object.keys(this.events[0]);
    const ruleFields = this.fieldRules.map(r => r.name);
    const fields = this.displayFields || allFields;

    return html`
      <field-rules
        .rules=${this.fieldRules}
        @delete-rule=${(e: CustomEvent) => this.deleteFieldRule(e.detail.field)}
        @edit-rule=${(e: CustomEvent) => this.editFieldRule(e.detail.rule)}
      ></field-rules>
      <field-filters
        .fields=${allFields}
        .display=${this.displayFields}
        @select-display=${(e: CustomEvent) =>
          this.selectDisplay(e.detail.fields)}
      ></field-filters>
      <table>
        <thead>
          <tr>
            <th>Annotate</th>
            ${fields.map(
              f => html`
                <th>
                  <strong @click=${() => this.focusDisplay(f)}>${f}</strong>
                  <button
                    class=${ruleFields.includes(f) ? 'active' : ''}
                    @click=${() => this.addFieldRule(f)}
                  >
                    ⚙
                  </button>
                </th>
              `,
            )}
          </tr>
        </thead>
        <tbody>
          ${collapseRows(this.events, this.fieldRules).map(
            e => html`
              <tr>
                <td><textarea rows="1"></textarea></td>
                ${fields.map(f => html`<td><pre>${e[f || '']}</pre></td>`)}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  addFieldRule(field: string): void {
    if (!this.fieldRules.map(r => r.name).includes(field)) {
      this.fieldRules = [...this.fieldRules, { name: field, collapse: 'none' }];
    }
  }

  deleteFieldRule(field: string): void {
    this.fieldRules = this.fieldRules.filter(r => r.name !== field);
  }

  editFieldRule(rule: FieldRule): void {
    this.fieldRules = this.fieldRules.map(r =>
      r.name === rule.name ? rule : r,
    );
  }

  focusDisplay(field: string): void {
    const fields = this.events.length > 0 ? Object.keys(this.events[0]) : [];
    this.displayFields = pickExistingFrom(fields, [
      ['EventID'],
      ['ClientTimestamp', 'ServerTimestamp'],
      [field],
    ]);
  }

  selectDisplay(fields: string[]): void {
    this.displayFields = fields;
  }

  static styles = css`
    table {
      max-width: 100%;
      max-height: 600px;
      overflow: auto;
    }
    table th {
      position: sticky;
      top: 0;
      background-color: white;
      text-align: left;
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
    table td textarea {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    table td pre {
      margin: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'event-timeline': EventTimeline;
  }
}

export default EventTimeline;
