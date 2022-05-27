export type PrimitiveValues = string | number | boolean | undefined;
export type PrimitiveFields = { [k: string]: PrimitiveValues };

export type ID = string;
export type Integer = number;
export type Real = number;
export type Timestamp = string | number;
export type Timezone = string;
export type URL = string;
export type RelativePath = string;

export type EventInitiator =
  | 'UserDirectAction'
  | 'UserIndirectAction'
  | 'ToolReaction'
  | 'ToolTimedEvent'
  | 'InstructorDirectAction'
  | 'InstructorIndirectAction'
  | 'TeamMemberDirectAction'
  | 'TeamMemberIndirectAction'
  | string;

export type EditType =
  | 'GenericEdit'
  | 'Insert'
  | 'Delete'
  | 'Replace'
  | 'Move'
  | 'Paste'
  | 'Undo'
  | 'Redo'
  | 'Refactor'
  | 'Reset'
  | string;

export type CompileResult = 'Success' | 'Warning' | 'Error';

export type SourceLocation = string | number;

export type ExecutionResult = 'Success' | 'Timeout' | 'Error' | 'TestFailed';

export type InterventionCategory =
  | 'Feedback'
  | 'Hint'
  | 'CodeHighlight'
  | 'CodeChange'
  | 'EarnedGrade'
  | string;
