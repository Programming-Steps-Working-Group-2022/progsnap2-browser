import { parse } from 'csv';
import { createReadStream } from 'fs';
import {
  checkProgsnap2CodeState,
  checkProgsnap2Event,
  ProgSnap2FormatError,
} from '../checks';
import { PrimitiveFields, ProgSnap2CodeState, ProgSnap2Event } from '../types';

const rowByRow = <T>(
  csvFile: string,
  map: (row: PrimitiveFields, count: number, records: T[]) => T | undefined,
) =>
  new Promise<T[]>(resolve => {
    let count = 0;
    const records: T[] = [];
    process.stdout.write(`Reading main table ${csvFile}\n`);
    const parser = parse({
      columns: true,
      cast: true,
    });
    parser.on('data', (row: unknown) => {
      count += 1;
      const r = map(row as PrimitiveFields, count, records);
      if (r !== undefined) {
        records.push(r);
      }
      if (count % 512 === 0) {
        process.stdout.write(`${count} rows parsed.\r`);
      }
    });
    parser.on('error', err => {
      process.stderr.write(`${err.message}\n`);
    });
    parser.on('end', () => {
      process.stdout.write(`${count} rows parsed.\n`);
      resolve(records);
    });
    createReadStream(csvFile).pipe(parser);
  });

export const readMainTable = (csvFile: string) =>
  rowByRow<ProgSnap2Event>(csvFile, (row, count) => {
    try {
      return checkProgsnap2Event(row);
    } catch (e: unknown) {
      if (e instanceof ProgSnap2FormatError) {
        process.stderr.write(`Error at line ${count}: ${e.message}\n`);
      } else {
        throw e;
      }
      return undefined;
    }
  });

export const readCodeStateTable = (csvFile: string) =>
  rowByRow<ProgSnap2CodeState>(csvFile, (row, count) => {
    try {
      return checkProgsnap2CodeState(row);
    } catch (e: unknown) {
      if (e instanceof ProgSnap2FormatError) {
        process.stderr.write(`Error at line ${count}: ${e.message}\n`);
      } else {
        throw e;
      }
      return undefined;
    }
  });
