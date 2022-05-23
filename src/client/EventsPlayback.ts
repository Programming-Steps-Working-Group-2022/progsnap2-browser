import { css, html, LitElement, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { ProgSnap2Event } from '../types';

@customElement('events-playback')
class EventsPlayback extends LitElement {
  @property({ type: Array })
  fields: string[] = [];

  @property({ type: Array })
  events: ProgSnap2Event[] = [];

  @state()
  private index = 0;

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

  render(): TemplateResult {
    const last = this.events.length - 1;
    const event = this.events[this.index];
    if (event === undefined) {
      return html`<p>Index out of bounds</p>`;
    }
    return html`
      <div class="wrap">
        <div class="controls">
          <button
            .disabled=${this.index < 1}
            @click=${() => this.setIndex(this.index - 1)}
          >
            ◀
          </button>
          <button @click=${() => this.toggleInterval()}>
            ${this.interval !== undefined ? 'Stop' : 'Play'}
          </button>
          <button
            .disabled=${this.index >= last}
            @click=${() => this.setIndex(this.index + 1)}
          >
            ▶
          </button>
        </div>
        <table>
          <tbody>
            ${this.fields.map(
              field => html`
                <tr>
                  <td>${field}</td>
                  <td>
                    ${field === 'X-CodeState'
                      ? html`<pre><code id="src">${event[field]}</code></pre>`
                      : html`<pre>${event[field]}</pre>`}
                  </td>
                </tr>
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
    this.index = index;
  }

  toggleInterval(): void {
    if (this.interval !== undefined) {
      this.stopPlayback();
    } else {
      this.interval = window.setInterval(() => {
        if (this.index < this.events.length - 1) {
          this.index += 1;
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

  keyboard(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.setIndex(this.index - 1);
        break;
      case 'ArrowRight':
        this.setIndex(this.index + 1);
        break;
      case ' ':
        this.toggleInterval();
        break;
      default:
        break;
    }
  }

  static styles = css`
    .controls {
      position: absolute;
      bottom: 10px;
      left: 50%;
      width: 200px;
      margin-left: -50px;
    }
    .controls button {
      font-size: 200%;
    }
    table td {
      vertical-align: top;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'events-playback': EventsPlayback;
  }
}

export default EventsPlayback;
