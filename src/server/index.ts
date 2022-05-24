import express from 'express';
import nocache from 'nocache';
import { readMainTable } from './reader';
import { calculateEventFilterOptions, filterEvents } from './operations';

export { readCodeStateTable, readMainTable } from './reader';
export { calculateEventFilterOptions, filterEvents } from './operations';

export const initializeServer = async (csvFile: string) => {
  const events = await readMainTable(csvFile, true);
  const filters = calculateEventFilterOptions(events);

  const app = express();
  app.use(express.static('static'));
  app.use(express.json());
  app.use(nocache());

  app.get('/api/filters', (_req, res) => {
    res.json(filters);
  });

  app.post('/api/events', (req, res) => {
    res.json(filterEvents(events, req.body));
  });

  return app;
};
