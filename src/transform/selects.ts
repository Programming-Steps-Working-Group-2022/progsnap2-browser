import { PrimitiveFields, ProgSnap2Event } from '../types';

export const filterEvents = (
  events: ProgSnap2Event[],
  filters: PrimitiveFields,
) => {
  const check = Object.entries(filters);
  return events.filter(event =>
    check.every(([field, accept]) => event[field] === accept),
  );
};
