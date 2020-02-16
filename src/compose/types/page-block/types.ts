export interface Button {
  script: string;

  // resource type (copied from ui hook)
  resourceType: string;

  // Can override hook's label
  label?: string;

  // can override hooks's variant
  variant?: string;

  enabled?: boolean;
}
