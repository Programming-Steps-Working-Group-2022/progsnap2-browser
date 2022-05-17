import { PrimitiveValues, ProgSnap2Event } from '../types';

export const pickExistingFrom = (all: string[], pick: string[][]): string[] =>
  pick
    .map(search => {
      for (let i = 0; i < search.length; i += 1) {
        if (all.includes(search[i])) {
          return search[i];
        }
      }
      return undefined;
    })
    .filter((s): s is string => s !== undefined);

export const checkLatency = (
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

/*
export const collapseEvents = (
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
*/
