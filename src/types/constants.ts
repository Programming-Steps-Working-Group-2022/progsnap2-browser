import { DisplayMode } from '.';
import { EventIndex } from './eventindex';

export const EVENT_ID_FIELDS = ['EventID'];
export const EVENT_TIME_FIELDS = ['ClientTimestamp', 'ServerTimestamp'];

export const EVENT_INDEX_FIELDS = [
  'CourseID',
  'CourseSectionID',
  'TermID',
  'AssignmentID',
  'ProblemID',
  'SubjectID',
  'CodeStateSection',
];

export const EVENT_HIDE_FIELDS = EVENT_INDEX_FIELDS.concat([
  'ToolInstances',
  'ServerTimestamp',
  'SourceLocation',
  'SourceLocations',
  'InsertText',
  'DeleteText',
  'X-Compilable',
  'X-Metadata',
  'TokenCount',
  'TokenLengths',
]);

export const EMPTY_INDEX = (): EventIndex => ({
  fields: [],
  levels: [],
});

export const DISPLAY_MODES: DisplayMode[] = ['Copy', 'Table', 'Play'];

export const RULE_COLLAPSE_MODES = [
  { id: 'none', label: 'No rule' },
  { id: 'time', label: 'Collapse while step latency below threshold' },
  { id: 'unchanged', label: 'Collapse while unchanged' },
  { id: 'empty', label: 'Collapse while empty' },
  { id: 'empty_or_unchanged', label: 'Collapse while unchanged or empty' },
];

export const DEFAULT_LATENCY_THRESHOLD = 5.0;
