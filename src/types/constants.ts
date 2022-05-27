import { EventIndex } from './eventindex';

export const EVENT_ID_FIELDS = ['EventID'];
export const EVENT_TIME_FIELDS = ['ServerTimestamp', 'ClientTimestamp'];

export const EVENT_INDEX_FIELDS = [
  'CourseID',
  'CourseSectionID',
  'TermID',
  'AssignmentID',
  'ProblemID',
  'SubjectID',
];

export const EMPTY_INDEX = (): EventIndex => ({
  fields: [],
  levels: [],
});

export const RULE_COLLAPSE_MODES = [
  { id: 'none', label: 'No rule' },
  { id: 'time', label: 'Collapse while step latency below threshold' },
  { id: 'unchanged', label: 'Collapse while unchanged' },
  { id: 'empty', label: 'Collapse while empty' },
  { id: 'empty_or_unchanged', label: 'Collapse while unchanged or empty' },
];

export const DEFAULT_LATENCY_THRESHOLD = 5.0;
