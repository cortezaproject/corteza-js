import { RowDefinition } from './filter'

// export class Frame {

// }

export class FrameDefinition {
  name?: string;
  source?: string;
  ref?: string;
  rows?: RowDefinition;
  // columns?: FrameColumnSet;

  paging?: { limit: number };
  // sorting: filter.SortExprSet;
}
