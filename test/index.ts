import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import server from '../src/server';
import { ProgSnap2Event } from '../src/types';

const API = suite('exports');

API('should export an object', () => {
  assert.type(server, 'object');
});

API.run();

// ---

const reader = suite('reader');
let events: ProgSnap2Event[];

reader.before(async () => {
  events = await server.readMainTable('test/test_data.csv');
});

reader('should read complete main table', () => assert.equal(events.length, 6));

reader('should calculate all filter options', () =>
  assert.equal(server.calculateEventFilterOptions(events), {
    CourseID: undefined,
    CourseSectionID: undefined,
    TermID: undefined,
    AssignmentID: ['A01', 'A02'],
    ProblemID: undefined,
    SubjectID: ['S01', 'S02'],
  }),
);

reader('should filter main table', () => {
  const subset = server.filterEvents(events, {
    SubjectID: ['S02'],
    AssignmentID: ['A01', 'A02'],
  });
  assert.equal(subset.length, 2);
});

reader.run();

// ---
