export interface RowDefinition {
  and?: Array<RowDefinition>;
  or?: Array<RowDefinition>;
  cells?: Map<string, CellDefinition>;
}

interface CellDefinition {
  op: string;
  value: string;
}
