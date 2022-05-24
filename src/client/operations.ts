import { PrimitiveValues, ProgSnap2Event } from '../types';
import { FieldRule, DEFAULT_LATENCY } from './FieldRules';

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

export const latencyLessThan = (
  t0: PrimitiveValues,
  t1: PrimitiveValues,
  thresholdSeconds: number,
): boolean =>
  typeof t0 === 'number' &&
  typeof t1 === 'number' &&
  t1 - t0 < thresholdSeconds * 1000;

export const looselyEqual = (v1: PrimitiveValues, v2: PrimitiveValues) =>
  v1 === v2 || v1?.toString().trim() === v2?.toString().trim();

const violatesRule = (
  rule: FieldRule,
  index: number,
  all: ProgSnap2Event[],
  accepted: ProgSnap2Event[],
) => {
  const v = all[index][rule.name];
  switch (rule.collapse) {
    case 'time':
      return (
        index < all.length - 1 &&
        latencyLessThan(
          v,
          all[index + 1][rule.name],
          rule.latency || DEFAULT_LATENCY,
        )
      );
    case 'unchanged':
      return (
        accepted.length > 0 &&
        looselyEqual(v, accepted[accepted.length - 1][rule.name])
      );
    case 'empty':
      return v === undefined || v === '';
    case 'empty_or_unchanged':
      return (
        v === undefined ||
        v === '' ||
        (accepted.length > 0 &&
          looselyEqual(v, accepted[accepted.length - 1][rule.name]))
      );
    default:
      return false;
  }
};

const passesRuleset = (
  andRules: FieldRule[],
  orRules: FieldRule[],
  index: number,
  all: ProgSnap2Event[],
  accepted: ProgSnap2Event[],
): boolean => {
  for (let i = 0; i < andRules.length; i += 1) {
    if (violatesRule(andRules[i], index, all, accepted)) {
      return false;
    }
  }
  for (let i = 0; i < orRules.length; i += 1) {
    if (!violatesRule(orRules[i], index, all, accepted)) {
      return true;
    }
  }
  return orRules.length === 0;
};

export const collapseRows = (
  events: ProgSnap2Event[],
  rules: FieldRule[],
): ProgSnap2Event[] => {
  const andRules = rules.filter(r => r.collapse === 'time');
  const orRules = rules.filter(r => !['none', 'time'].includes(r.collapse));
  const accepted: ProgSnap2Event[] = [];
  for (let i = 0; i < events.length; i += 1) {
    if (passesRuleset(andRules, orRules, i, events, accepted)) {
      accepted.push(events[i]);
    }
  }
  return accepted;
};
