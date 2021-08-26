import { FilterDefinition } from './filter'

export interface FrameColumn {
  kind?: string;
  label?: string;
  name?: string;
  primary?: boolean;
  unique?: boolean;
}

export class FrameDefinition {
  name?: string;
  source?: string;
  ref?: string;

  sort?: string;
  filter?: FilterDefinition;
  paging?: { limit: number };

  refValue?: string;
  relColumn?: string;
  relSource?: string;

  columns?: Array<FrameColumn>;
  rows?: Array<string>;
}
