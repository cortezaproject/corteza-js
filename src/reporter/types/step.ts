export interface Step {
  group?: StepGroup;
  load?: StepLoad;
  join?: StepJoin;
  transform?: StepTransform;
}

interface GroupKey {
  column: string;
  name: string;
  expr: string;
}

export interface StepGroup {
  name: string;
  dimension: string;
  groups?: Array<GroupKey>;
  columns?: Array<{ [key: string]: { [key: string]: string } }>;
}

export interface StepLoad {
  name: string;
  source?: string;
  definition?: { [key: string]: unknown};
  rows?: RowDefinition;
}

export interface StepJoin {
  name: string;
  local: string;
  foreign: string;
  rows?: RowDefinition;
}

interface TransformColumn {
  name: string;
  expr: string;
  rows: unknown;
}

export interface StepTransform {
  name?: string;
  dimension?: string;
  columns?: Array<TransformColumn>;
  rows?: RowDefinition;
}

export interface RowDefinition {
  and?: Array<RowDefinition>;
  or?: Array<RowDefinition>;
  cells?: Map<string, CellDefinition>;
}

interface CellDefinition {
  op: string;
  value: string;
}

export function StepFactory (step: Partial<Step>): Step {
  const k = Object.keys(step)[0]
  switch (k) {
    case 'load':
      return step as Step
    case 'join':
      return step as Step
    case 'group':
      return step as Step
    case 'transform':
      return step as Step
    default:
      throw new Error('unknown step: ' + k)
  }
}
