import { ConstraintMatcher } from './constraints'

export interface Constraint {
  name?:
      string;
  op?:
      string;
  value:
      string[];
}

export const onManual = 'onManual'

export interface HandlerFn {
  (ev: Event): Promise<unknown>;
}

export interface Trigger {
  eventTypes: string[];
  resourceTypes: string[];
  weight?: number;
  constraints?: Constraint[];
  scriptName?: string;
}

interface SortableScript {
  weight: number;
}

export function scriptSorter (a: SortableScript, b: SortableScript): number {
  return a.weight - b.weight
}

export interface Event {
  resourceType: string;
  eventType: string;
  match?: { (c: ConstraintMatcher): boolean };
}
