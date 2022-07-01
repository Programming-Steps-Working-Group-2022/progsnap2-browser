import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import { pickExistingFrom, skipListed, collapseRows } from '../transform';
import {
  ProgSnap2Event,
  FieldRule,
  EVENT_TIME_FIELDS,
  EVENT_ID_FIELDS,
  EVENT_HIDE_FIELDS,
} from '../types';

@customElement('events-view')
class EventsView extends LitElementNoShadow {
  @property({ type: Array })
  events?: ProgSnap2Event[] = undefined;

  @property({ type: Number })
  step = 0;

  @state()
  private fieldRules: FieldRule[] = [];

  @state()
  private displayFields?: string[] = undefined;

  @state()
  private playbackMode = false;

  render(): TemplateResult {
    if (this.events === undefined) {
      return html`<div class="loader">Loading events...</div>`;
    }
    if (this.events.length === 0) {
      return html`<div>No events available</div>`;
    }
    const allFields = Object.keys(this.events[0]);
    const fields =
      this.displayFields || skipListed(allFields, EVENT_HIDE_FIELDS);
    const events = collapseRows(this.events, this.fieldRules);

    return html`
      <div class="playback-mode">
        <button .disabled=${!this.playbackMode} @click=${this.togglePlayback}>
          Table
        </button>
        <button .disabled=${this.playbackMode} @click=${this.togglePlayback}>
          Play
        </button>
      </div>
      <field-rules
        .rules=${this.fieldRules}
        .rowCount=${events.length}
        @delete-rule=${(e: CustomEvent) => this.deleteFieldRule(e.detail.field)}
        @edit-rule=${(e: CustomEvent) => this.editFieldRule(e.detail.rule)}
      ></field-rules>
      <field-filters
        .fields=${allFields}
        .display=${fields}
        @select-display=${(e: CustomEvent) =>
          this.selectDisplay(e.detail.fields)}
      ></field-filters>
      <div class="events-view">
        ${this.playbackMode
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
              .events=${events}
              .step=${this.step}
              @focus-display=${(e: CustomEvent) =>
                this.focusDisplay(e.detail.field)}
              @add-rule=${(e: CustomEvent) => this.addFieldRule(e.detail.field)}
            ></events-table>`}
      </div>
    `;
  }

  togglePlayback(): void {
    this.playbackMode = !this.playbackMode;
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
