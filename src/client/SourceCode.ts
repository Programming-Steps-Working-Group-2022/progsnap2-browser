import { html, TemplateResult } from 'lit';
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

  @property({ type: String })
  diff: PrimitiveValues = undefined;

  render(): TemplateResult {
    // TODO support diff
    const code = hljs.highlightAuto(this.src?.toString() || '').value;
    return html`<pre><code class="hljs">${unsafeHTML(code)}</code></pre>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'source-code': SourceCode;
  }
}

export default SourceCode;
