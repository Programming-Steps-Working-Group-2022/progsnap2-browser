import express from 'express';
import morgan from 'morgan';
import nocache from 'nocache';
import open from 'open';
import CSVServer from './csvserver';
import DataBaseServer from './dbserver';
import { AppServer } from '../types';

const port = process.env.PORT || 3333;

/* eslint-disable no-console */

const run = async (
  constructor: () => Promise<AppServer>,
  openInBrowser?: boolean,
) => {
  const srv = await constructor();
  const app = express();
  app.use(morgan('combined'));
  app.use(express.static('static'));
  app.use(express.json());
  app.use(nocache());

  app.get('/api/ds/', async (_req, res) => {
    res.json(await srv.getDatasets());
  });

  app.get('/api/ds/:ds/index', async (req, res) => {
    res.json(await srv.getIndex(req.params.ds));
  });

  app.post('/api/ds/:ds/select', async (req, res) => {
    res.json(await srv.getEvents(req.params.ds, req.body));
  });

  app.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log(`Server listening at ${url}`);
    if (openInBrowser) {
      open(url);
    }
  });
};

if (process.argv.length !== 3) {
  console.log('Runs a local server to browse ProgSnap2 compatible CSV table.');
  console.log('Usage: npm start <my_dataset/MainTable.csv>');
} else if (process.argv[2] === 'db') {
  run(async () => DataBaseServer());
} else {
  run(async () => CSVServer(process.argv[2]), true);
}
