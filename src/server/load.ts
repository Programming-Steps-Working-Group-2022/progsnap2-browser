import { existsSync, readFileSync } from 'fs';
import { buildEventIndex, filterEvents, iterateIndex } from '../transform';
import { readMainTable } from './csvreader';
import DataBaseServer from './dbserver';

/* eslint-disable no-console */

const load = async (id: string, csvFile: string, description: string) => {
  const db = await DataBaseServer();
  const events = await readMainTable(csvFile, true);
  console.log(`Drop data for "${id}" if any exists`);
  await db.dropDataset(id);
  const index = buildEventIndex(events);
  const meta = { id, description };
  console.log(`Add new dataset ${JSON.stringify(meta)}`);
  await db.addDataset(meta);
  console.log(`Set dataset index`);
  await db.setIndex(id, index);
  const filters = iterateIndex(index);
  for (let i = 0; i < filters.length; i += 1) {
    const fl = filters[i];
    console.log(`Add events for ${JSON.stringify(fl)}`);
    // eslint-disable-next-line no-await-in-loop
    await db.addEvents(id, fl, filterEvents(events, fl));
  }
  console.log('Finished');
  process.exit(0);
};

const readIfFile = (fileName: string): string => {
  if (existsSync(fileName)) {
    return readFileSync(fileName, 'utf-8');
  }
  return fileName;
};

if (process.argv.length !== 5) {
  console.log('Loads a ProgSnap2 compatible CSV table to the local database.');
  console.log(
    'Usage: npm load <dataset_id> <my_dataset/MainTable.csv> <description.txt>',
  );
} else {
  load(process.argv[2], process.argv[3], readIfFile(process.argv[4]));
}
