import { html, TemplateResult } from 'lit';
/* eslint-disable import/extensions */
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import LitElementNoShadow from './LitElementNoShadow';
import { PrimitiveValues } from '../types';

@customElement('source-code')
class SourceCode extends LitElementNoShadow {
  @property({ type: String })
  src: PrimitiveValues = undefined;

  render(): TemplateResult {
    return html`
      <pre><code class="hljs">${unsafeHTML(
        hljs.highlightAuto(this.src?.toString() || '').value,
      )}</code></pre>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'source-code': SourceCode;
  }
}

export default SourceCode;
