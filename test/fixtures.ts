import { EventIndex, EventIndexOptions } from '../src/types';

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
