import { PrimitiveValues } from './fields';

export interface EventIndex {
  fields: string[];
  levels: EventIndexLevel;
}

export type EventIndexLevel = (
  | PrimitiveValues
  | [PrimitiveValues, EventIndexLevel]
)[];

export type EventIndexOptions = {
  field: string;
  selected: PrimitiveValues;
  options: {
    value: PrimitiveValues;
    size: number;
  }[];
}[];
