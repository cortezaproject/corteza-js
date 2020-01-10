/**
 * EventBus handles all implicit (all but onManual) Corteza events
 *
 * 1. Corredor prepares a bundle that is loaded on a client
 * 2. Bundle provides a "callback" function that accepts EventBus object +
 *    all context information and configuration that is needed for
 *    handler registration
 * 3. When a "Corteza event" is dispatched (see Dispatch() on EventBus)
 *    event-bus searches for handler and passes on event information
 */

import { Event } from './events'
import { Handler, HandlerFn, Trigger } from './handlers'

/**
 * EventBus for listening and handling explicit client scripts (no onManual)
 *
 * Since we have much shorter execution path here than we have in case of server scripts,
 * we can afford some optimisation (in comparison to backend's pkg/eventbus)
 */
export class EventBus {
  private handlers: Handler[] = []

  /**
   * Dispatches all events
   * @param {Event} ev Event to dispatch
   */
  async Dispatch (ev: Event): Promise<null> {
    const matchedTriggers = this.find(ev)

    try {
      for (const t of matchedTriggers) {
        const result = await t.Handle(ev)
        if (result === false) {
          return Promise.reject(new Error('aborted'))
        }
      }
    } catch (err) {
      return Promise.reject(err)
    }

    return null
  }

  /**
   * Filters and sorts all handlers by event & constraints
   * @param {Event} ev Event to use for filtering handlers
   */
  private find (ev: Event): Handler[] {
    return this.handlers
      .filter(t => t.Match(ev))
      .sort((t1, t2) => t1.weight - t2.weight)
  }

  /**
   * Registers Event handler
   * @param {HandlerFn} h Handler function
   * @param {Trigger} t Trigger definition
   */
  Register (handler: HandlerFn, trigger: Trigger): EventBus {
    this.handlers.push(new Handler(handler, trigger))
    return this
  }

  /**
   * Unregisters all handlers
   */
  UnregisterAll (): EventBus {
    this.handlers = []
    return this
  }
}
