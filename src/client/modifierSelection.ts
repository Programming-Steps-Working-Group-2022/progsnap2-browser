import { html, TemplateResult } from 'lit';

export interface Modifiers {
  codeStateOnly: boolean;
  collapseSteps: boolean;
  maxLatency: number;
  maxCharacters: number;
}

const modifierSelection = (
  select: (m: Modifiers) => void,
  modifiers: Modifiers,
): TemplateResult => {
  const selectCheckbox = (name: 'codeStateOnly' | 'collapseSteps') => {
    select({ ...modifiers, ...Object.fromEntries([[name, !modifiers[name]]]) });
  };

  const selectNumber = (
    name: 'maxLatency' | 'maxCharacters',
    input: HTMLInputElement,
  ) => {
    select({ ...modifiers, ...Object.fromEntries([[name, input.value]]) });
  };

  return html`
    <div class="modifiers">
      <label>
        <input
          type="checkbox"
          ?checked=${modifiers.codeStateOnly}
          @change=${() => selectCheckbox('codeStateOnly')}
        />
        Only timestamp & code state
      </label>
      <label>
        <input
          type="checkbox"
          ?checked=${modifiers.collapseSteps}
          @change=${() => selectCheckbox('collapseSteps')}
        />
        Collapse steps where less than
      </label>
      <input
        type="number"
        value=${modifiers.maxLatency}
        @change=${(e: Event) =>
          selectNumber('maxLatency', e.target as HTMLInputElement)}
      />
      seconds latency between and less than
      <input
        type="number"
        value=${modifiers.maxCharacters}
        @change=${(e: Event) =>
          selectNumber('maxCharacters', e.target as HTMLInputElement)}
      />
      characters changed at a step.
    </div>
  `;
};

export default modifierSelection;
