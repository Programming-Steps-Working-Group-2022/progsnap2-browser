import { EventIndex, EventIndexOptions, PrimitiveFields } from '../src/types';

export const CHECK_KEYS = [
  'EventID',
  'ToolInstances',
  'ServerTimestamp',
  'SubjectID',
  'AssignmentID',
  'EventType',
  'CodeStateID',
  'Score',
  'X-FooBar',
  'EditType',
];

export const CHECK_INDEX: EventIndex = {
  fields: ['AssignmentID', 'SubjectID'],
  levels: [
    ['A01', ['S01', 'S02']],
    ['A02', ['S01', 'S02', 'S03']],
  ],
};

export const TEST_INDEX: EventIndex = {
  fields: ['A', 'B'],
  levels: [
    [0, ['aa', 'bb', 'cc']],
    [1, ['aa', 'bb']],
  ],
};

export const TEST_OPTIONS: EventIndexOptions = [
  {
    field: 'A',
    selected: 1,
    options: [
      { value: 0, size: 3 },
      { value: 1, size: 2 },
    ],
  },
  {
    field: 'B',
    selected: 'aa',
    options: [
      { value: 'aa', size: 0 },
      { value: 'bb', size: 0 },
    ],
  },
];

export const TEST_ITERATION: PrimitiveFields[] = [
  { A: 0, B: 'aa' },
  { A: 0, B: 'bb' },
  { A: 0, B: 'cc' },
  { A: 1, B: 'aa' },
  { A: 1, B: 'bb' },
];
