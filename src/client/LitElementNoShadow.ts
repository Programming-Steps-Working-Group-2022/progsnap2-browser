import { LitElement } from 'lit';

class LitElementNoShadow extends LitElement {
  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }
}

export default LitElementNoShadow;
