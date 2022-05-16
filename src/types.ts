export type ProgSnap2Event =
  | SessionEvent
  | ProjectEvent
  | FileUnaryEvent
  | FileBinaryEvent
  | FileEditEvent
  | CompileEvent
  | CompileMessageEvent
  | SubmitEvent
  | RunEvent
  | TestEvent
  | ViewEvent
  | InterventionEvent
  | CustomEvent;

export type PrimitiveValues = string | number | boolean | undefined;
export type PrimitiveFields = { [k: string]: PrimitiveValues };

interface BaseEventFields extends PrimitiveFields {
  EventID: ID;
  SubjectID: ID;
  ToolInstances: string;
  CodeStateID: ID;
  Order?: Integer;
  ServerTimestamp?: Timestamp;
  ServerTimezone?: Timezone;
  ClientTimestamp?: Timestamp;
  ClientTimezone?: Timezone;
  CourseID?: ID;
  CourseSectionID?: ID;
  TermID?: string;
  AssignmentID?: ID;
  AssignmentIsGraded?: boolean;
  ProblemID?: ID;
  ProblemIsGraded?: boolean;
  Attempt?: Integer;
  ExperimentalCondition?: string;
  TeamID?: ID;
  LoggingErrorID?: ID;
}

export interface SessionEvent extends BaseEventFields {
  EventType: 'Session.Start' | 'Session.End';
  SessionID: ID;
}

export interface ProjectEvent extends BaseEventFields {
  EventType: 'Project.Open' | 'Project.Close';
  ProjectID: ID;
}

export interface FileUnaryEvent extends BaseEventFields {
  EventType:
    | 'File.Create'
    | 'File.Delete'
    | 'File.Open'
    | 'File.Close'
    | 'File.Focus';
  CodeStateSection: RelativePath;
  EventInitiator?: EventInitiator;
}

export interface FileBinaryEvent extends BaseEventFields {
  EventType: 'File.Rename' | 'File.Copy';
  CodeStateSection: RelativePath;
  DestinationCodeStateSection: RelativePath;
  EventInitiator?: EventInitiator;
}

export interface FileEditEvent extends BaseEventFields {
  EventType: 'File.Edit';
  CodeStateSection: RelativePath;
  EventInitiator?: EventInitiator;
  EditType: EditType;
  SourceLocation?: SourceLocation;
}

export interface CompileEvent extends BaseEventFields {
  EventType: 'Compile';
  CodeStateSection: RelativePath;
  EventInitiator?: EventInitiator;
  CompileResult: CompileResult;
}

export interface CompileMessageEvent extends BaseEventFields {
  EventType: 'Compile.Error' | 'Compile.Warning';
  ParentEventID: ID;
  CodeStateSection: RelativePath;
  CompileMessageType: string;
  CompileMessageData: string;
  SourceLocation: SourceLocation;
}

export interface SubmitEvent extends BaseEventFields {
  EventType: 'Submit';
  ExecutionID?: ID;
  Score?: Real;
  ExtraCreditScore?: Real;
}

export interface RunEvent extends BaseEventFields {
  EventType: 'Run.Program' | 'Debug.Program';
  ExecutionID?: ID;
  ExecutionResult: ExecutionResult;
  Score?: Real;
  ExtraCreditScore?: Real;
  ProgramInput?: URL;
  ProgramOutput?: URL;
  ProgramErrorOutput?: URL;
}

export interface TestEvent extends BaseEventFields {
  EventType: 'Run.Test' | 'Debug.Test';
  ExecutionID: ID;
  TestID: ID;
  ExecutionResult: ExecutionResult;
  Score?: Real;
  ExtraCreditScore?: Real;
  ProgramInput?: URL;
  ProgramOutput?: URL;
  ProgramErrorOutput?: URL;
}

export interface ViewEvent extends BaseEventFields {
  EventType: 'Resource.View';
  ResourceID: ID;
}

export interface InterventionEvent extends BaseEventFields {
  EventType: 'Intervention';
  EventInitiator: EventInitiator;
  InterventionCategory: InterventionCategory;
  InterventionType: string;
  InterventionMessage: string;
}

export interface CustomEvent extends BaseEventFields {
  EventType: string;
}

export type ID = string;
export type Integer = number;
export type Real = number;
export type Timestamp = string;
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

export interface ProgSnap2CodeState extends PrimitiveFields {
  CodeStateID: string;
  Code: string;
}
