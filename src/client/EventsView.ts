import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import {
  pickExistingFrom,
  collapseRows,
  defaultVisibleFields,
} from '../transform';
import {
  ProgSnap2Event,
  FieldRule,
  EVENT_TIME_FIELDS,
  EVENT_ID_FIELDS,
  DisplayMode,
  DISPLAY_MODES,
  PrimitiveFields,
} from '../types';

@customElement('events-view')
class EventsView extends LitElementNoShadow {
  @property({ type: Array })
  events?: ProgSnap2Event[] = undefined;

  @property({ type: Number })
  step = 0;

  @property({ type: Array })
  insertFields: string[] = [];

  @property({ type: Object })
  inserted: { [id: string]: PrimitiveFields } = {};

  @state()
  private fieldRules: FieldRule[] = [];

  @state()
  private displayFields?: string[] = undefined;

  @state()
  private displayMode: DisplayMode = 'Table';

  render(): TemplateResult {
    if (this.events === undefined) {
      return html`<div class="loader">Loading events...</div>`;
    }
    if (this.events.length === 0) {
      return html`<div>No events available</div>`;
    }
    const allFields = Object.keys(this.events[0]);
    const fields = this.displayFields || defaultVisibleFields(allFields);
    const events = collapseRows(this.events, this.fieldRules);

    return html`
      <div class="playback-mode">
        ${DISPLAY_MODES.map(
          mode => html`
            <button
              .disabled=${this.displayMode === mode}
              @click=${() => this.selectMode(mode)}
            >
              ${mode}
            </button>
          `,
        )}
      </div>
      <field-rules
        .rules=${this.fieldRules}
        .rowStep=${this.step}
        .rowCount=${events.length}
        @delete-rule=${(e: CustomEvent) => this.deleteFieldRule(e.detail.field)}
        @edit-rule=${(e: CustomEvent) => this.editFieldRule(e.detail.rule)}
      ></field-rules>
      <field-filters
        .fields=${allFields}
        .insertFields=${this.insertFields}
        .display=${fields}
        @select-display=${(e: CustomEvent) =>
          this.selectDisplay(e.detail.fields)}
      ></field-filters>
      <div class="events-view">
        ${this.displayMode === 'Play'
          ? html`<events-playback
              .fields=${fields}
              .ruleFields=${this.fieldRules.map(r => r.field)}
              .events=${events}
              .step=${this.step}
              @add-rule=${(e: CustomEvent) => this.addFieldRule(e.detail.field)}
            ></events-playback>`
          : html`<events-table
              .fields=${fields}
              .ruleFields=${this.fieldRules.map(r => r.field)}
              .insertFields=${this.insertFields}
              .events=${events}
              .step=${this.step}
              .inserted=${this.inserted}
              .copy=${this.displayMode === 'Copy'}
              @focus-display=${(e: CustomEvent) =>
                this.focusDisplay(e.detail.field)}
              @add-rule=${(e: CustomEvent) => this.addFieldRule(e.detail.field)}
            ></events-table>`}
      </div>
    `;
  }

  selectMode(mode: DisplayMode): void {
    this.displayMode = mode;
    const selection = window.getSelection();
    const node = document.querySelector('.events-view');
    selection?.removeAllRanges();
    if (selection && mode === 'Copy' && node) {
      const range = document.createRange();
      range.selectNode(node);
      selection.addRange(range);
      setTimeout(() => document.execCommand('copy'), 500);
    }
  }

  addFieldRule(field: string): void {
    if (!this.fieldRules.map(r => r.field).includes(field)) {
      this.fieldRules = [...this.fieldRules, { field, collapse: 'none' }];
    }
  }

  deleteFieldRule(field: string): void {
    this.fieldRules = this.fieldRules.filter(r => r.field !== field);
  }

  editFieldRule(rule: FieldRule): void {
    this.fieldRules = this.fieldRules.map(r =>
      r.field === rule.field ? rule : r,
    );
  }

  focusDisplay(field: string): void {
    if (this.events !== undefined && this.events.length > 0) {
      this.displayFields = pickExistingFrom(Object.keys(this.events[0]), [
        EVENT_ID_FIELDS,
        EVENT_TIME_FIELDS,
        [field],
      ]);
    }
  }

  selectDisplay(fields: string[]): void {
    this.displayFields = fields;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'events-view': EventsView;
  }
}

export default EventsView;
