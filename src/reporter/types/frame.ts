import { FilterDefinition } from './filter'

export class FrameDefinition {
  name?: string;
  source?: string;
  ref?: string;

  sort?: string;
  filter?: FilterDefinition;
  paging?: { limit: number };
  //columns?: FrameColumnSet;
}
