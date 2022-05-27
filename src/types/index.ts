export * from './fields';
export * from './events';
export * from './codestates';
export * from './eventindex';
export * from './constants';
export * from './servers';

export interface Dataset {
  id: string;
  description: string;
}

export interface FieldRule {
  field: string;
  collapse: string;
  latency?: number;
}
