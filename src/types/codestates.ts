import { ID, PrimitiveFields } from './fields';

export interface ProgSnap2CodeState extends PrimitiveFields {
  CodeStateID: ID;
  Code: string;
}
