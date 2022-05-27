import { readMainTable } from './csvreader';
import { buildEventIndex, filterEvents } from '../transform';
import { AppServer, EMPTY_INDEX, PrimitiveFields } from '../types';

const CSVServer = async (csvFile: string): Promise<AppServer> => {
  const events = await readMainTable(csvFile, true);
  const index = buildEventIndex(events);
  return {
    getDatasets: async () => [{ id: 'csv', description: 'Loaded from csv' }],
    getIndex: async (ds: string) => (ds === 'csv' ? index : EMPTY_INDEX()),
    getEvents: async (ds: string, filters: PrimitiveFields) =>
      ds === 'csv' ? filterEvents(events, filters) : [],
  };
};

export default CSVServer;
