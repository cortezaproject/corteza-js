import { ConstraintMatcher } from './constraints'
import { Event } from './events'

interface Constraint {
  name?:
      string;
  op?:
      string;
  value:
      string[];
}

export interface HandlerFn {
  (ev: Event): Promise<unknown>;
}

export interface Trigger {
  eventTypes: string[];
  resourceTypes: string[];
  weight?: number;
  constraints?: Constraint[];
}

// Dummy handler, can be used for tests
export async function DummyHandler (): Promise<undefined> { return undefined }

export class Handler {
  readonly resourceTypes: string[];
  readonly eventTypes: string[];
  readonly constraints: ConstraintMatcher[];
  readonly weight: number;
  readonly handle: HandlerFn;

  constructor (h: HandlerFn, t: Trigger) {
    this.handle = h
    this.eventTypes = t.eventTypes
    this.resourceTypes = t.resourceTypes
    this.weight = t.weight || 0
    // @todo parse constraints to constaints matchers
    this.constraints = []
  }

  /**
   * Match event and trigger - type, resource, constraints
   *
   * @param {Event} ev
   * @return bool
   */
  Match (ev: Event): boolean {
    if (!this.eventTypes.includes(ev.EventType())) {
      return false
    }

    if (!this.resourceTypes.includes(ev.ResourceType())) {
      return false
    }

    // Event should match all trigger's constraints
    for (const c of this.constraints) {
      if (!ev.Match(c)) {
        return false
      }
    }

    return true
  }

  Handle (ev: Event): Promise<unknown> {
    return this.handle(ev)
  }
}
