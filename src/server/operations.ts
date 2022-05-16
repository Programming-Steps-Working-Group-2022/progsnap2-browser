import { PrimitiveFields, PrimitiveValues, ProgSnap2Event } from '../types';

export const unique = (
  data: PrimitiveFields[],
  key: string,
): PrimitiveValues[] => [...new Set(data.map(entry => entry[key]))].sort();

export interface FilterOptions {
  CourseID?: PrimitiveValues[];
  CourseSectionID?: PrimitiveValues[];
  TermID?: PrimitiveValues[];
  AssignmentID?: PrimitiveValues[];
  ProblemID?: PrimitiveValues[];
  SubjectID?: PrimitiveValues[];
}

export const EVENT_FILTER_FIELDS: (keyof FilterOptions)[] = [
  'CourseID',
  'CourseSectionID',
  'TermID',
  'AssignmentID',
  'ProblemID',
  'SubjectID',
];

export const calculateEventFilterOptions = (
  data: ProgSnap2Event[],
): FilterOptions =>
  Object.fromEntries(
    EVENT_FILTER_FIELDS.map(key => [
      key,
      data[0][key] !== undefined ? unique(data, key) : undefined,
    ]),
  );

export const matchEvent = (event: ProgSnap2Event, filters: FilterOptions) =>
  EVENT_FILTER_FIELDS.every(
    key =>
      filters[key] === undefined || (filters[key] || []).includes(event[key]),
  );

export const filterEvents = (data: ProgSnap2Event[], filters: FilterOptions) =>
  data.filter(event => matchEvent(event, filters));
