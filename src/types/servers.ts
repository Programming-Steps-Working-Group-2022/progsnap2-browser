import { Dataset } from '.';
import { EventIndex } from './eventindex';
import { ProgSnap2Event } from './events';
import { PrimitiveFields } from './fields';

export interface AppServer {
  getDatasets: () => Promise<Dataset[]>;
  getIndex: (ds: string) => Promise<EventIndex>;
  getEvents: (
    ds: string,
    filters: PrimitiveFields,
  ) => Promise<ProgSnap2Event[]>;
}

export interface AdminServer extends AppServer {
  addDataset: (ds: Dataset) => Promise<void>;
  setIndex: (ds: string, index: EventIndex) => Promise<void>;
  addEvents: (
    ds: string,
    index: PrimitiveFields,
    events: ProgSnap2Event[],
  ) => Promise<void>;
  resetDataset: (ds: string) => Promise<void>;
  dropDataset: (ds: string) => Promise<void>;
}
