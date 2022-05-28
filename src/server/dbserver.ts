import { MongoClient } from 'mongodb';
import {
  AdminServer,
  Dataset,
  EMPTY_INDEX,
  EventIndex,
  PrimitiveFields,
  ProgSnap2Event,
} from '../types';

const dbConnect = process.env.DB || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'progsnap2browser';

const C_DATASETS = 'datasets';
const C_FILTERS = 'filters';
const C_EVENTS = 'events';

/* eslint-disable no-console */

const DataBaseServer = async (): Promise<AdminServer> => {
  console.log(`Connecting to database ${dbConnect}`);
  const client = new MongoClient(dbConnect);
  await client.connect();
  const db = client.db(dbName);
  return {
    addDataset: async (ds: Dataset) => {
      await db.collection(C_DATASETS).insertOne(ds);
    },
    getDatasets: async () => {
      const docs = await db.collection(C_DATASETS).find({}).toArray();
      return docs as unknown[] as Dataset[];
    },
    setIndex: async (ds: string, index: EventIndex) => {
      await db
        .collection(C_FILTERS)
        .replaceOne({ ds }, { ds, index }, { upsert: true });
    },
    getIndex: async (ds: string) => {
      const doc = await db.collection(C_FILTERS).findOne({ ds });
      return doc !== null ? (doc.index as EventIndex) : EMPTY_INDEX();
    },
    addEvents: async (
      ds: string,
      index: PrimitiveFields,
      events: ProgSnap2Event[],
    ) => {
      await db
        .collection(C_EVENTS)
        .replaceOne({ ds, index }, { ds, index, events }, { upsert: true });
    },
    getEvents: async (ds: string, index: PrimitiveFields) => {
      const doc = await db.collection(C_EVENTS).findOne({ ds, index });
      return doc !== null ? (doc.events as ProgSnap2Event[]) : [];
    },
    resetDataset: async (ds: string) => {
      await db.collection(C_EVENTS).deleteMany({ ds });
      await db.collection(C_FILTERS).deleteMany({ ds });
    },
    dropDataset: async (ds: string) => {
      await db.collection(C_EVENTS).deleteMany({ ds });
      await db.collection(C_FILTERS).deleteMany({ ds });
      await db.collection(C_DATASETS).deleteMany({ id: ds });
    },
  };
};

export default DataBaseServer;
