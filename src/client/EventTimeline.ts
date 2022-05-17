import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { pickExistingFrom } from './operations';
import { ProgSnap2Event } from '../types';

@customElement('event-timeline')
class EventTimeline extends LitElement {
  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @state()
  displayFields?: string[] = undefined;

  render(): TemplateResult {
    if (!this.events.length) {
      return html`<div>No events available</div>`;
    }
    const allFields = Object.keys(this.events[0]);
    const fields = this.displayFields || allFields;

    return html`
      <field-filters
        .fields=${allFields}
        .display=${this.displayFields}
        @select-display=${this.selectDisplay}
      ></field-filters>
      <table>
        <thead>
          <tr>
            ${fields.map(
              f => html`<th @click=${() => this.focusDisplay(f)}>${f}</th>`,
            )}
          </tr>
        </thead>
        <tbody>
          ${this.events.map(
            e => html`
              <tr>
                ${fields.map(f => html`<td><pre>${e[f || '']}</pre></td>`)}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  selectDisplay(event: CustomEvent): void {
    this.displayFields = event.detail.fields;
  }

  focusDisplay(field: string): void {
    const fields = this.events.length > 0 ? Object.keys(this.events[0]) : [];
    this.displayFields = pickExistingFrom(fields, [
      ['EventID'],
      ['ClientTimestamp', 'ServerTimestamp'],
      [field],
    ]);
  }

  static styles = css`
    table {
      max-width: 100%;
      max-height: 600px;
      border: 2px solid grey;
      overflow: auto;
    }
    table th {
      position: sticky;
      top: 0;
      background-color: white;
      text-align: left;
      text-decoration: underline;
      cursor: pointer;
    }
    table td {
      border: 1px solid lightgray;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'event-timeline': EventTimeline;
  }
}

export default EventTimeline;
