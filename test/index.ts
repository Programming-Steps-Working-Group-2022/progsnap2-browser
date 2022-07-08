import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { CHECK_INDEX, CHECK_KEYS, TEST_INDEX, TEST_ITERATION, TEST_OPTIONS } from './fixtures';
import { checkProgsnap2Event, ProgSnap2Event } from '../src/types';
import { readMainTable } from '../src/server/csvreader';
import {
  buildEventIndex,
  collapseRows,
  diffSpans,
  filterEvents,
  indexToOptions,
  iterateIndex,
} from '../src/transform';

// ---

const eventsSuite = suite('events');
let events: ProgSnap2Event[];

eventsSuite.before(async () => {
  events = await readMainTable('test/test_data.csv', true);
});

eventsSuite('should read complete main table', () => assert.equal(events.length, 7));

eventsSuite('should not add extra columns', () => assert.equal(Object.keys(events[0]), CHECK_KEYS));

eventsSuite('should parse dates correctly', () =>
  assert.ok(
    events.every(e => new Date(e.ServerTimestamp || 0).getFullYear() === 2022),
  ),
);

eventsSuite('should calculate complete table index', () =>
  assert.equal(buildEventIndex(events), CHECK_INDEX),
);

eventsSuite('should filter subject data from table', () => {
  const subset1 = filterEvents(events, {
    SubjectID: 'S01',
    AssignmentID: 'A02',
  });
  assert.ok(subset1.every(e => e.SubjectID === 'S01'));
  assert.ok(subset1.every(e => e.AssignmentID === 'A02'));
  assert.equal(subset1.length, 2);

  const subset2 = filterEvents(events, {
    SubjectID: 'S02',
    AssignmentID: 'A01',
  });
  assert.ok(subset2.every(e => e.SubjectID === 'S02'));
  assert.ok(subset2.every(e => e.AssignmentID === 'A01'));
  assert.equal(subset2.length, 1);
});

eventsSuite('should generate default index options', () => {
  const options = indexToOptions(TEST_INDEX, {});
  assert.equal(
    options.map(o => o.selected),
    [0, 'aa'],
  );
});

eventsSuite('should present index options for a selection', () => {
  const options = indexToOptions(TEST_INDEX, { A: 1, B: 'aa' });
  assert.equal(options, TEST_OPTIONS);
});

eventsSuite('should iterate over index', () => {
  const all = iterateIndex(TEST_INDEX);
  assert.equal(all, TEST_ITERATION);
});

eventsSuite.run();

// ---

const rulesSuite = suite('rules');
let all: ProgSnap2Event[];

rulesSuite.before(async () => {
  all = await readMainTable('test/test_data.csv', true);
});

rulesSuite('should collapse empty rows', () => {
  const pass = collapseRows(all, [{ field: 'X-FooBar', collapse: 'empty' }]);
  assert.equal(
    pass.map(e => e.EventID),
    ['0', '2', '3', '4', '6', '7'],
  );
});

rulesSuite('should collapse unchanged rows', () => {
  const pass = collapseRows(all, [
    { field: 'X-FooBar', collapse: 'unchanged' },
  ]);
  assert.equal(
    pass.map(e => e.EventID),
    ['0', '3', '5', '6', '7'],
  );
});

rulesSuite('should collapse empty or unchanged rows', () => {
  const pass = collapseRows(all, [
    { field: 'X-FooBar', collapse: 'empty_or_unchanged' },
  ]);
  assert.equal(
    pass.map(e => e.EventID),
    ['0', '3', '7'],
  );
});

rulesSuite('should collapse rows by latency threshold', () => {
  const pass = collapseRows(all, [
    { field: 'ServerTimestamp', collapse: 'time', latency: 10 },
  ]);
  assert.equal(
    pass.map(e => e.EventID),
    ['0', '2', '4', '5', '6', '7'],
  );
});

rulesSuite('should combibe rules correctly', () => {
  const pass = collapseRows(all, [
    { field: 'ServerTimestamp', collapse: 'time', latency: 10 },
    { field: 'X-FooBar', collapse: 'empty_or_unchanged' },
  ]);
  assert.equal(
    pass.map(e => e.EventID),
    ['0', '4', '7'],
  );
});

rulesSuite.run();

// ---

const miscSuite = suite('misc');

miscSuite('should check events without unnecessary additions', () =>
  assert.equal(
    checkProgsnap2Event({
      EventID: '1',
      SubjectID: 's01',
      EventType: 'X-Test',
    }),
    {
      EventID: '1',
      SubjectID: 's01',
      EventType: 'X-Test',
      ToolInstances: '-',
      CodeStateID: '-',
    }
  ));

miscSuite('should create correct diff', () =>
  assert.equal(
    diffSpans('Yesterday', 'Thursday'),
    '<span class="rm"></span><span class="add">Yeste</span>r<span class="rm"></span>day',
  )
);

miscSuite.run();
