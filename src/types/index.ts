export * from './fields';
export * from './events';
export * from './checks';
export * from './codestates';
export * from './eventindex';
export * from './constants';
export * from './servers';

export interface Dataset {
  id: string;
  description: string;
}

export type DisplayMode = 'Copy' | 'Table' | 'Play';

export interface FieldRule {
  field: string;
  collapse: string;
  latency?: number;
}
