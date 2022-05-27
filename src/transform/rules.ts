import { FieldRule, ProgSnap2Event, DEFAULT_LATENCY_THRESHOLD } from '../types';
import { latencyLessThan, looselyEqual } from './helpers';

export const violatesRule = (
  rule: FieldRule,
  index: number,
  all: ProgSnap2Event[],
  accepted: ProgSnap2Event[],
) => {
  const v = all[index][rule.field];
  const last = (field: string) => accepted[accepted.length - 1][field];
  switch (rule.collapse) {
    case 'time':
      return (
        index < all.length - 1 &&
        latencyLessThan(
          v,
          all[index + 1][rule.field],
          rule.latency || DEFAULT_LATENCY_THRESHOLD,
        )
      );
    case 'unchanged':
      return accepted.length > 0 && looselyEqual(v, last(rule.field));
    case 'empty':
      return v === undefined || v === '';
    case 'empty_or_unchanged':
      return (
        v === undefined ||
        v === '' ||
        (accepted.length > 0 && looselyEqual(v, last(rule.field)))
      );
    default:
      return false;
  }
};

export const collapseRows = (
  events: ProgSnap2Event[],
  rules: FieldRule[],
): ProgSnap2Event[] => {
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
