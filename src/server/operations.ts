import {
  EVENT_FILTER_FIELDS,
  EventFilterOptions,
  PrimitiveFields,
  PrimitiveValues,
  ProgSnap2Event,
} from '../types';

export const unique = (
  data: PrimitiveFields[],
  key: string,
): PrimitiveValues[] => [...new Set(data.map(entry => entry[key]))].sort();

export const calculateEventFilterOptions = (
  data: ProgSnap2Event[],
): EventFilterOptions =>
  Object.fromEntries(
    EVENT_FILTER_FIELDS.map(key => [
      key,
      data.length > 0 && data[0][key] !== undefined
        ? unique(data, key)
        : undefined,
    ]),
  );

export const filterEvents = (
  data: ProgSnap2Event[],
  filters: EventFilterOptions,
) => {
  const check = EVENT_FILTER_FIELDS.map(field => ({
    field,
    accept: filters[field] || [],
  })).filter(({ accept }) => accept.length > 0);
  return data.filter(event =>
    check.every(({ field, accept }) => accept.includes(event[field])),
  );
};
