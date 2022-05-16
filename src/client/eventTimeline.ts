import { html, TemplateResult } from 'lit';
import { ProgSnap2Event, PrimitiveValues } from '../types';
import { Modifiers } from './modifierSelection';

type TimeAndCode = [string?, string?];

const timeAndCodeFields = (fields: string[]): TimeAndCode => {
  const select: TimeAndCode = [undefined, undefined];
  if (fields.includes('ClientTimestamp')) {
    select[0] = 'ClientTimestamp';
  } else if (fields.includes('ServerTimestamp')) {
    select[0] = 'ServerTimestamp';
  }
  if (fields.includes('X-CodeState')) {
    select[1] = 'X-CodeState';
  } else if (fields.includes('CodeStateID')) {
    select[1] = 'CodeStateID';
  }
  return select;
};

const checkLatency = (
  d0: PrimitiveValues,
  d1: PrimitiveValues,
  max: number,
): boolean => {
  if (d0 === undefined || d1 === undefined) {
    return true;
  }
  return (
    (new Date(`${d1}`).getTime() - new Date(`${d0}`).getTime()) / 1000 >= max
  );
};

// const checkCharacters =

const collapseEvents = (
  events: ProgSnap2Event[],
  modifiers: Modifiers,
  timeAndCode: TimeAndCode,
) => {
  const select: ProgSnap2Event[] = [];
  let last: ProgSnap2Event | undefined;
  for (let i = 0; i < events.length; i += 1) {
    const e: ProgSnap2Event = events[i];
    if (
      last === undefined ||
      checkLatency(
        last[timeAndCode[0] || ''],
        e[timeAndCode[0] || ''],
        modifiers.maxLatency,
      )
    ) {
      select.push(e);
    }
    last = e;
  }
  return select;
};

const eventTimeline = (
  events: ProgSnap2Event[],
  modifiers: Modifiers,
): TemplateResult => {
  if (!events.length) {
    return html`<div class="error">No events available</div>`;
  }

  const allFields = Object.keys(events[0]);
  const timeAndCode = timeAndCodeFields(allFields);
  const fields = modifiers.codeStateOnly ? timeAndCode : allFields;

  const visible = modifiers.collapseSteps
    ? collapseEvents(events, modifiers, timeAndCode)
    : events;

  return html`
    <table class="events">
      <thead>
        <tr>
          ${fields.map(f => html`<th>${f}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${visible.map(
          e => html`
            <tr>
              ${fields.map(f => html`<td><pre>${e[f || '']}</pre></td>`)}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
};

export default eventTimeline;
