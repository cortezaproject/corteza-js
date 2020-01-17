/**
 * EventBus handles all Corteza events on browser (!! not on corredor server !!)
 *
 * Flow #1
 *  1. Corredor prepares a bundle that is loaded on a client
 *  2. Bundle provides a "callback" function that accepts EventBus object +
 *     all context information and configuration that is needed for
 *     handler registration
 * 3a. When a "Corteza event" is dispatched (Dispatch())
 *     event-bus searches for handler and passes on event information
 * 3b. When manual event is executed (Exec())
 *     event-bus searches for handler and passes on event information
 *
 * Flow #2
 *   1. When web application is initialized, it should register all
 *      explicit server scripts
 *   2. These server scripts are wrapped with a handlerFn that forwards call
 *      to the API (there, request is passed to the Corredor where it's executed)
 *
 */

import { Event, ManualEvent } from './events'
import { Handler } from './handlers'
import { HandlerFn, onManual, scriptSorter, Trigger } from './shared'

/**
 * EventBus for event dispatching and handling
 *
 * Since we have much shorter execution path here than we have in case of server scripts,
 * we can afford some optimisation (in comparison to backend's pkg/eventbus)
 */
export class EventBus {
  private handlers: Handler[] = []

  /**
   * Dispatches event and waits for all handlers
   *
   * It refuses to dispatch explicit (onManual) events
   *
   * Handling handler results works a bit different then on backend.
   * Scripts executed with handlers have DIRECT access to values passed (by reference)
   * as arguments via event so there's no need to do an explicit return
   *
   * @param {Event} ev Event to dispatch
   */
  async WaitFor (ev: Event): Promise<null> {
    if (ev.EventType() === onManual) {
      return null
    }

    const matched = this.find(ev)
    try {
      for (const t of matched) {
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
   * Executes onManual event that references a specific script
   *
   * It expects a ManualEvent
   *
   * @param ev
   * @constructor
   */
  async Exec (ev: ManualEvent): Promise<null> {
    if (ev.EventType() !== onManual) {
      return null
    }

    const matched = this.find(ev)

    if (matched.length === 0) {
      return null
    }

    const result = await matched.pop()!.Handle(ev)
    if (result === false) {
      return Promise.reject(new Error('aborted'))
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
      .sort(scriptSorter)
  }

  /**
   * Registers Event handler
   *
   * @param handler Handler function
   * @param trigger Trigger definition
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
