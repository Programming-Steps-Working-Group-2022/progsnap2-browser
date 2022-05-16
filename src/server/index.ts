import { readCodeStateTable, readMainTable } from './reader';
import { calculateEventFilterOptions, filterEvents } from './operations';

export default {
  readMainTable,
  readCodeStateTable,
  calculateEventFilterOptions,
  filterEvents,
};
