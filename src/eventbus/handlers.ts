import { ConstraintMaker, ConstraintMatcher } from './constraints'
import { Event, ManualEvent } from './events'
import { HandlerFn, onManual, Trigger } from './shared'
import { IsOf } from '../guards'


// Dummy handler, can be used for tests
export async function DummyHandler (): Promise<undefined> { return undefined }

export class Handler {
  readonly resourceTypes: string[];
  readonly eventTypes: string[];
  readonly constraints: ConstraintMatcher[];
  readonly weight: number;
  readonly handle: HandlerFn;

  /**
   * Script
   */
  readonly scriptName?: string

  constructor (h: HandlerFn, t: Trigger) {
    if (t.scriptName && !t.eventTypes.includes(onManual)) {
      throw new Error('cannot make handler from trigger with script name without onManual eventType')
    }

    if (!t.scriptName && t.eventTypes.includes(onManual)) {
      throw new Error('cannot make handler from trigger with onManual eventType without script name')
    }

    this.handle = h
    this.eventTypes = t.eventTypes
    this.resourceTypes = t.resourceTypes
    this.weight = t.weight || 0
    // @todo parse constraints to constraint matchers
    this.constraints = t.constraints ? t.constraints.map(ConstraintMaker) : []
    this.scriptName = t.scriptName
  }

  /**
   * Match this handler with a given event - type, resource, constraints + scriptName when ManualEvent
   *
   * @param {Event} ev
   * @return bool
   */
  Match (ev: Event|ManualEvent): boolean {
    if (!this.eventTypes.includes(ev.EventType())) {
      return false
    }

    if (!this.resourceTypes.includes(ev.ResourceType())) {
      return false
    }

    if (IsOf<ManualEvent>(ev, 'ScriptName')) {
      if (this.scriptName !== ev.ScriptName()) {
        return false
      }
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
