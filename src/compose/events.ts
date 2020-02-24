import { Event, onManual } from '../eventbus/shared'
import { Module } from './types/module'
import { Record, Values } from './types/record'
import { Namespace } from './types/namespace'
import { ConstraintMatcher } from '../eventbus/constraints'
import { IsOf } from '../guards'

interface TriggerEndpoints {
  automationTriggerScript (params: { script: string }): Promise<object>;
  namespaceTriggerScript (params: { namespaceID: string; script: string }): Promise<object>;
  moduleTriggerScript (params: { namespaceID: string; moduleID: string; script: string }): Promise<object>;
  recordTriggerScript (params: { namespaceID: string; moduleID: string; recordID: string; values: Values; script: string }): Promise<object>;
}

function namespaceMatcher (r: Namespace, c: ConstraintMatcher, def: boolean): boolean {
  // keep in sync with server/compose/service/events/namespace.go
  switch (c.Name()) {
    case 'namespace':
    case 'namespace.slug':
      return c.Match(r.slug)
    case 'namespace.name':
      return c.Match(r.name)
  }

  return def
}

function moduleMatcher (r: Module, c: ConstraintMatcher, def: boolean): boolean {
  // keep in sync with server/compose/service/events/module.go
  switch (c.Name()) {
    case 'module':
    case 'module.handle':
      return c.Match(r.handle)
    case 'module.name':
      return c.Match(r.name)
  }

  return def
}

/**
 * Creates event for compose resource with ready-to-go-defaults
 */
export function ComposeEvent (event?: Partial<Event>): Event {
  return {
    eventType: onManual,
    resourceType: 'compose',
    match: (): boolean => true,
    ...event,
  }
}

/**
 * Creates namespace event with ready-to-go-defaults
 */
export function NamespaceEvent (res: Namespace, event?: Partial<Event>): Event {
  return {
    eventType: onManual,
    resourceType: res.resourceType,
    match: (c): boolean => namespaceMatcher(res, c, false),
    ...event,

    // Override the arguments at the end
    args: { namespace: res, ...event?.args },
  }
}

/**
 * Creates module event with ready-to-go-defaults
 */
export function ModuleEvent (res: Module, event?: Partial<Event>): Event {
  return {
    eventType: onManual,
    resourceType: res.resourceType,
    match: (c): boolean => namespaceMatcher(res.namespace, c, moduleMatcher(res, c, false)),
    ...event,

    // Override the arguments at the end
    args: { module: res, ...event?.args },
  }
}

/**
 * Creates record event with ready-to-go-defaults
 */
export function RecordEvent (res: Record, event?: Partial<Event>): Event {
  return {
    eventType: onManual,
    resourceType: res.resourceType,
    match: (c): boolean => namespaceMatcher(res.namespace, c, moduleMatcher(res.module, c, false)),
    ...event,

    // Override the arguments at the end
    args: { record: res, module: res.module, ...event?.args },
  }
}

export function TriggerComposeScriptOnManual (api: TriggerEndpoints) {
  return (ev: Event, script: string): Promise<unknown> => {
    const params = { script, args: ev.args }

    if (ev.resourceType === 'compose') {
      return api
        .automationTriggerScript({ ...params })
    }

    if (!ev.args) {
      throw new Error('expecting args prop in event')
    }

    if (ev.resourceType === 'compose:namespace') {
      if (!IsOf<Namespace>(ev.args.namespace, 'namespaceID')) {
        throw new Error('expecting args.namespace in event arguments')
      }

      const { namespaceID } = ev.args.namespace as Namespace
      return api
        .namespaceTriggerScript({ namespaceID, ...params })
    }

    if (ev.resourceType === 'compose:module') {
      if (!IsOf<Module>(ev.args.module, 'namespaceID', 'moduleID')) {
        throw new Error('expecting args.module in event arguments')
      }

      const { namespaceID, moduleID } = ev.args.module as Module

      return api
        .moduleTriggerScript({ namespaceID, moduleID, ...params })
    }

    if (ev.resourceType === 'compose:record') {
      if (!IsOf<Record>(ev.args.record, 'namespaceID', 'moduleID', 'recordID')) {
        throw new Error('expecting args.record in event arguments')
      }

      const record = ev.args.record as Record
      const { namespaceID, moduleID, recordID, values } = record

      return api
        .recordTriggerScript({ namespaceID, moduleID, recordID, values, ...params })
        .then(rval => record.apply(rval))
    }

    throw Error(`cannot trigger server script: unknown resource type '${ev.resourceType}'`)
  }
}
