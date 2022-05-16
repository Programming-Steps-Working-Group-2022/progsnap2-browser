import open from 'open';
import { initializeServer } from '.';

/* eslint-disable no-console */

const port = process.env.PORT || 3333;

const loadAndStart = async (csvFile: string) => {
  const app = await initializeServer(csvFile);
  app.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log(`Server listening at ${url}`);
    open(url);
  });
};

if (process.argv.length !== 3) {
  console.log('Runs a local server to browse ProgSnap2 compatible CSV table.');
  console.log('Usage: npm start [my_dataset/MainTable.csv]');
} else {
  loadAndStart(process.argv[2]);
}
