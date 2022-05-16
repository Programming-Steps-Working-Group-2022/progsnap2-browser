import {
  PrimitiveValues,
  PrimitiveFields,
  ProgSnap2Event,
  SessionEvent,
  ProjectEvent,
  FileUnaryEvent,
  FileBinaryEvent,
  FileEditEvent,
  CompileEvent,
  CompileMessageEvent,
  SubmitEvent,
  RunEvent,
  TestEvent,
  ViewEvent,
  InterventionEvent,
  CustomEvent,
  ProgSnap2CodeState,
} from './types';

export class ProgSnap2FormatError extends Error {}

interface FieldProperties {
  required?: boolean;
  default?: PrimitiveValues;
  type?: 'number' | 'boolean' | 'numberOrString';
  oneOf?: string[];
}

const checkField = (
  name: string,
  value: PrimitiveValues,
  opt: FieldProperties,
): PrimitiveValues => {
  if (value !== undefined) {
    switch (opt.type) {
      case 'number':
        if (typeof value !== 'number') {
          throw new ProgSnap2FormatError(
            `Not a number type in "${name}"="${value}"`,
          );
        }
        return value;
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new ProgSnap2FormatError(
            `Not a boolean type in "${name}"="${value}"`,
          );
        }
        return value;
      case 'numberOrString':
        if (!['string', 'number'].includes(typeof value)) {
          throw new ProgSnap2FormatError(
            `Not a string or number format in "${name}"="${value}"`,
          );
        }
        return value;
      default:
        if (opt.oneOf !== undefined) {
          if (typeof value !== 'string' || !opt.oneOf.includes(value)) {
            throw new ProgSnap2FormatError(
              `Not one of ${opt.oneOf
                .map(o => `"${o}"`)
                .join(', ')} in "${name}"="${value}"`,
            );
          }
        }
        if (value === '') {
          if (opt.required) {
            throw new ProgSnap2FormatError(`Missing column "${name}"=""`);
          }
          return undefined;
        }
        return `${value}`;
    }
  }
  if (opt.default !== undefined) {
    return opt.default;
  }
  if (opt.required) {
    throw new ProgSnap2FormatError(`Missing column "${name}"`);
  }
  return undefined;
};

interface FieldNameAndProperties extends FieldProperties {
  name: string;
}

const checkObject = (
  row: PrimitiveFields,
  fields: FieldNameAndProperties[],
): PrimitiveFields => ({
  ...row,
  ...Object.fromEntries(
    fields.map(props => [
      props.name,
      checkField(props.name, row[props.name], props),
    ]),
  ),
});

export const checkProgsnap2Event = (obj: PrimitiveFields): ProgSnap2Event => {
  const commonFields: FieldNameAndProperties[] = [
    { name: 'EventID', required: true },
    { name: 'SubjectID', required: true },
    { name: 'ToolInstances', required: true },
    { name: 'CodeStateID', required: true },
    { name: 'EventType', required: true },
    { name: 'Order', type: 'number' },
    { name: 'ServerTimestamp' },
    { name: 'ServerTimezone' },
    { name: 'ClientTimestamp' },
    { name: 'ClientTimezone' },
    { name: 'CourseID' },
    { name: 'CourseSectionID' },
    { name: 'TermID' },
    { name: 'AssignmentID' },
    { name: 'AssignmentIsGraded', type: 'boolean' },
    { name: 'ProblemID' },
    { name: 'ProblemIsGraded', type: 'boolean' },
    { name: 'Attempt', type: 'number' },
    { name: 'ExperimentalCondition' },
    { name: 'TeamID' },
    { name: 'LoggingErrorID' },
  ];
  const getRunOrTestFields = (
    testFields: boolean,
  ): FieldNameAndProperties[] => [
    { name: 'ExecutionID', required: testFields },
    { name: 'TestID', required: testFields },
    {
      name: 'ExecutionResult',
      default: 'Success',
      oneOf: ['Success', 'Timeout', 'Error', 'TestFailed'],
    },
    { name: 'Score', type: 'number' },
    { name: 'ExtraCreditScore', type: 'number' },
    { name: 'ProgramInput' },
    { name: 'ProgramOutput' },
    { name: 'ProgramErrorOutput' },
  ];
  switch (obj.EventType) {
    case 'Session.Start':
    case 'Session.End':
      return checkObject(
        obj,
        commonFields.concat([{ name: 'SessionID', required: true }]),
      ) as SessionEvent;
    case 'Project.Open':
    case 'Project.Close':
      return checkObject(
        obj,
        commonFields.concat([{ name: 'ProjectID', required: true }]),
      ) as ProjectEvent;
    case 'File.Create':
    case 'File.Delete':
    case 'File.Open':
    case 'File.Close':
    case 'File.Focus':
      return checkObject(
        obj,
        commonFields.concat([
          { name: 'CodeStateSection', required: true },
          { name: 'EventInitiator' },
        ]),
      ) as FileUnaryEvent;
    case 'File.Rename':
    case 'File.Copy':
      return checkObject(
        obj,
        commonFields.concat([
          { name: 'CodeStateSection', required: true },
          { name: 'DestinationCodeStateSection', required: true },
          { name: 'EventInitiator' },
        ]),
      ) as FileBinaryEvent;
    case 'File.Edit':
      return checkObject(
        obj,
        commonFields.concat([
          { name: 'CodeStateSection', required: true },
          { name: 'EventInitiator' },
          { name: 'EditType', required: true },
          { name: 'SourceLocation', type: 'numberOrString' },
        ]),
      ) as FileEditEvent;
    case 'Compile':
      return checkObject(
        obj,
        commonFields.concat([
          { name: 'CodeStateSection', required: true },
          { name: 'EventInitiator' },
          {
            name: 'CompileResult',
            required: true,
            oneOf: ['Success', 'Error', 'Warning'],
          },
        ]),
      ) as CompileEvent;
    case 'Compile.Error':
    case 'Compile.Warning':
      return checkObject(
        obj,
        commonFields.concat([
          { name: 'ParentEventID', required: true },
          { name: 'CodeStateSection', required: true },
          { name: 'CompileMessageType', required: true },
          { name: 'CompileMessageData', required: true },
          { name: 'SourceLocation', required: true, type: 'numberOrString' },
        ]),
      ) as CompileMessageEvent;
    case 'Submit':
      return checkObject(
        obj,
        commonFields.concat([
          { name: 'ExecutionID' },
          { name: 'Score', type: 'number' },
          { name: 'ExtraCreditScore', type: 'number' },
        ]),
      ) as SubmitEvent;
    case 'Run.Program':
    case 'Debug.Program':
      return checkObject(
        obj,
        commonFields.concat(getRunOrTestFields(false)),
      ) as RunEvent;
    case 'Run.Test':
    case 'Debug.Test':
      return checkObject(
        obj,
        commonFields.concat(getRunOrTestFields(true)),
      ) as TestEvent;
    case 'Resource.View':
      return checkObject(obj, [
        { name: 'ResourceID', required: true },
      ]) as ViewEvent;
    case 'Intervention':
      return checkObject(obj, [
        { name: 'EventInitiator', required: true },
        { name: 'InterventionCategory', required: true },
        { name: 'InterventionType', required: true },
        { name: 'InterventionMessage', required: true },
      ]) as InterventionEvent;
    default:
      return checkObject(obj, commonFields) as CustomEvent;
  }
};

export const checkProgsnap2CodeState = (
  obj: PrimitiveFields,
): ProgSnap2CodeState =>
  checkObject(obj, [
    { name: 'CodeStateID', required: true },
    { name: 'Code', required: true },
  ]) as ProgSnap2CodeState;
