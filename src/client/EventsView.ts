import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import { pickExistingFrom, collapseRows } from './operations';
import { ProgSnap2Event } from '../types';
import { FieldRule } from './FieldRules';
import './styles.css';

@customElement('events-view')
class EventsView extends LitElementNoShadow {
  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @state()
  private fieldRules: FieldRule[] = [];

  @state()
  private displayFields?: string[] = undefined;

  @state()
  private playbackMode = false;

  render(): TemplateResult {
    if (!this.events.length) {
      return html`<div>No events available</div>`;
    }
    const allFields = Object.keys(this.events[0]);
    const fields = this.displayFields || allFields;
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
        @delete-rule=${(e: CustomEvent) => this.deleteFieldRule(e.detail.field)}
        @edit-rule=${(e: CustomEvent) => this.editFieldRule(e.detail.rule)}
      ></field-rules>
      <field-filters
        .fields=${allFields}
        .display=${this.displayFields}
        @select-display=${(e: CustomEvent) =>
          this.selectDisplay(e.detail.fields)}
      ></field-filters>
      <div class="events-view">
        ${this.playbackMode
          ? html`<events-playback
              .fields=${fields}
              .events=${events}
            ></events-playback>`
          : html`<events-table
              .fields=${fields}
              .ruleFields=${this.fieldRules.map(r => r.name)}
              .events=${events}
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
}

declare global {
  interface HTMLElementTagNameMap {
    'events-view': EventsView;
  }
}

export default EventsView;
