import {
  EMPTY_INDEX,
  EventIndex,
  EventIndexLevel,
  EventIndexOptions,
  EVENT_INDEX_FIELDS,
  PrimitiveFields,
  PrimitiveValues,
  ProgSnap2Event,
} from '../types';
import { unique } from './helpers';

export const buildEventIndex = (events: ProgSnap2Event[]): EventIndex => {
  const recursion = (
    children: ProgSnap2Event[],
    fields: string[],
  ): EventIndexLevel => {
    const field = fields[0];
    const values = unique(children, field).sort();
    return fields.length > 1
      ? values.map(value => [
          value,
          recursion(
            children.filter(e => e[field] === value),
            fields.slice(1),
          ),
        ])
      : values;
  };
  if (events.length > 0) {
    const first = events[0];
    const fields = EVENT_INDEX_FIELDS.filter(key => first[key] !== undefined);
    if (fields.length > 0) {
      return {
        fields,
        levels: recursion(events, fields),
      };
    }
  }
  return EMPTY_INDEX();
};

export const indexToOptions = (
  index: EventIndex,
  selection: PrimitiveFields,
): EventIndexOptions => {
  const recursion = (
    fields: string[],
    level: EventIndexLevel,
  ): EventIndexOptions => {
    const field = fields[0];
    const search = selection[field];
    let selected: PrimitiveValues | undefined;
    let next: EventIndexLevel | undefined;
    const options = level.map(o => {
      if (Array.isArray(o)) {
        const [v, n] = o;
        if (selected === undefined || v === search) {
          selected = v;
          next = n;
        }
        return { value: v, size: n.length };
      }
      if (selected === undefined || o === search) {
        selected = o;
      }
      return { value: o, size: 0 };
    });
    if (fields.length > 1) {
      return [
        { field, selected, options },
        ...recursion(fields.slice(1), next || []),
      ];
    }
    return [{ field, selected, options }];
  };
  return recursion(index.fields, index.levels);
};
