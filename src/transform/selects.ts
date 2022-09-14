import { EVENT_HIDE_FIELDS, PrimitiveFields, ProgSnap2Event } from '../types';
import { skipListed } from './helpers';

export const filterEvents = (
  events: ProgSnap2Event[],
  filters: PrimitiveFields,
) => {
  const check = Object.entries(filters);
  return events.filter(event =>
    check.every(([field, accept]) => event[field] === undefined || event[field] === accept),
  );
};

export const defaultVisibleFields = (fields: string[]) => {
  const visible = skipListed(fields, EVENT_HIDE_FIELDS);
  if (visible.includes('X-CodeState')) {
    return visible.filter(f => f !== 'CodeStateID');
  }
  return visible;
};
