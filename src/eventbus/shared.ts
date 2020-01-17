import { Event } from './events'

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

export function scriptSorter (a: { weight: number }, b: { weight: number }): number {
  return a.weight - b.weight
}
