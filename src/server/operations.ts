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
      data[0][key] !== undefined ? unique(data, key) : undefined,
    ]),
  );

export const matchEvent = (
  event: ProgSnap2Event,
  filters: EventFilterOptions,
) =>
  EVENT_FILTER_FIELDS.every(
    key =>
      filters[key] === undefined || (filters[key] || []).includes(event[key]),
  );

export const filterEvents = (
  data: ProgSnap2Event[],
  filters: EventFilterOptions,
) => data.filter(event => matchEvent(event, filters));
