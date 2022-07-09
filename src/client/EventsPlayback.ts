import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import LitElementNoShadow from './LitElementNoShadow';
import { EVENT_TIME_FIELDS, ProgSnap2Event } from '../types';
import { intervalString } from '../transform';

@customElement('events-playback')
class EventsPlayback extends LitElementNoShadow {
  @property({ type: Array })
  fields: string[] = [];

  @property({ type: Array })
  ruleFields: string[] = [];

  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @property({ type: Number })
  step = 0;

  @state()
  private interval?: number = undefined;

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', e => this.keyboard(e));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', e => this.keyboard(e));
  }

  keyboard(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.setIndex(this.step - 1);
        break;
      case 'ArrowRight':
        this.setIndex(this.step + 1);
        break;
      case ' ':
        this.toggleInterval();
        break;
      default:
        break;
    }
  }

  render(): TemplateResult {
    const last = this.events.length - 1;
    const event = this.events[this.step];
    const previous = this.step > 0 ? this.events[this.step - 1] : undefined;
    if (event === undefined) {
      return html`<p>Index out of bounds</p>`;
    }
    return html`
      <div class="playback-wrap">
        <div class="playback-controls">
          <button
            .disabled=${this.step < 1}
            @click=${() => this.setIndex(this.step - 1)}
          >
            ◀
          </button>
          <button @click=${() => this.toggleInterval()}>
            ${this.interval !== undefined ? 'Stop' : 'Play'}
          </button>
          <button
            .disabled=${this.step >= last}
            @click=${() => this.setIndex(this.step + 1)}
          >
            ▶
          </button>
        </div>
        <table class="playback-fields">
          <tbody>
            ${this.fields.map(
              field => html`
                <tr>
                  <th>${field}</th>
                  <td>
                    <event-field
                      .event=${event}
                      .previous=${previous}
                      .field=${field}
                      .code=${true}
                    ></event-field>
                  </td>
                </tr>
                ${EVENT_TIME_FIELDS.includes(field)
                  ? html`
                      <tr>
                        <th>Delay</th>
                        <td>
                          <pre>
${intervalString(event[field], previous && previous[field])}</pre
                          >
                        </td>
                      </tr>
                    `
                  : ''}
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  setIndex(index: number): void {
    if (this.interval !== undefined) {
      this.stopPlayback();
    }
    if (index >= 0 && index < this.events.length) {
      this.broadcastIndex(index);
    }
  }

  toggleInterval(): void {
    if (this.interval !== undefined) {
      this.stopPlayback();
    } else {
      this.interval = window.setInterval(() => {
        if (this.step < this.events.length - 1) {
          this.broadcastIndex(this.step + 1);
        } else {
          this.stopPlayback();
        }
      }, 400);
    }
  }

  stopPlayback(): void {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  broadcastIndex(step: number): void {
    this.dispatchEvent(
      new CustomEvent('set-step', { detail: { step }, bubbles: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'events-playback': EventsPlayback;
  }
}

export default EventsPlayback;
