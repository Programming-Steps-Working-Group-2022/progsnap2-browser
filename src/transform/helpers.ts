import { PrimitiveFields, PrimitiveValues } from '../types';

export const unique = (
  data: PrimitiveFields[],
  key: string,
): PrimitiveValues[] => [...new Set(data.map(entry => entry[key]))].sort();

export const withField = (
  obj: PrimitiveFields,
  field: string,
  value: PrimitiveValues,
): PrimitiveFields => ({
  ...obj,
  ...Object.fromEntries([[field, value]]),
});

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

export const skipListed = (all: string[], skip: string[]): string[] =>
  all.filter(s => !skip.includes(s));

export const looselyEqual = (v1: PrimitiveValues, v2: PrimitiveValues) =>
  v1 === v2 || v1?.toString().trim() === v2?.toString().trim();

export const latencyLessThan = (
  timestamp1: PrimitiveValues,
  timestamp2: PrimitiveValues,
  thresholdSeconds: number,
): boolean =>
  typeof timestamp1 === 'number' &&
  typeof timestamp2 === 'number' &&
  timestamp2 - timestamp1 < thresholdSeconds * 1000;

const padToNN = (n: number) => n.toString().padStart(2, '0');

export const intervalString = (
  now: PrimitiveValues,
  previous: PrimitiveValues,
) => {
  if (typeof now === 'number' && typeof previous === 'number') {
    const d = (now - previous) / 1000;
    if (d < 3600) {
      return `${padToNN(Math.floor(d / 60))}:${padToNN(Math.round(d % 60))}`;
    }
    return `${(d / 3600).toFixed(1)} h`;
  }
  return '';
};
