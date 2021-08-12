export interface FilterDefinition {
  ref: string;
  args: Array<KV>
}

interface KV {
  [header: string]: unknown;
}
