interface DatasetColumn {
  name: string;
  label?: string;
}

export interface DatasetDefinition {
  name: string;
  dimension: string;
  columns?: Array<DatasetColumn>;

  // @todo...
  rows?: unknown;
  paging?: unknown;
  sorting?: unknown;
}
