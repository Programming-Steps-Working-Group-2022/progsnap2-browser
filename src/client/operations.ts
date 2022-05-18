import { PrimitiveValues, ProgSnap2Event } from '../types';
import { FieldRule } from './FieldRules';

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

export const getLatency = (
  d0: PrimitiveValues,
  d1: PrimitiveValues,
): number => {
  return new Date(`${d1}`).getTime() - new Date(`${d0}`).getTime();
};

export const looselyEqual = (v1: PrimitiveValues, v2: PrimitiveValues) =>
  v1 === v2 || v1?.toString().trim() === v2?.toString().trim();

export const collapseRows = (
  events: ProgSnap2Event[],
  rules: FieldRule[],
): ProgSnap2Event[] => {
  const cleanRules = rules.filter(r => r.collapse !== 'none');
  if (cleanRules.length === 0) {
    return events;
  }
  const last = events.length - 1;
  return events.filter((e, i) =>
    cleanRules.some(r => {
      const v = e[r.name];
      switch (r.collapse) {
        case 'time':
          // TODO check this...
          return i === last || getLatency(v, events[i + 1][r.name]);
        case 'unchanged':
          return i === 0 || !looselyEqual(v, events[i - 1][r.name]);
        case 'empty':
          return v !== undefined && v !== '';
        default:
          return true;
      }
    }),
  );
};
