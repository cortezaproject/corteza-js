import { Event, onManual } from '../eventbus/shared'
import { Module } from './types/module'
import { Record } from './types/record'
import { Namespace } from './types/namespace'
import { ConstraintMatcher } from '../eventbus/constraints'

interface TriggerEndpoints {
  automationTriggerScript (params: { script: string }): Promise<object>;
  namespaceTriggerScript (params: { namespaceID: string; script: string }): Promise<object>;
  moduleTriggerScript (params: { moduleID: string; script: string }): Promise<object>;
  recordTriggerScript (params: { recordID: string; script: string }): Promise<object>;
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
    match: (c) => true,
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
    match: (c) => namespaceMatcher(res, c, false),
    args: { namespace: res, ...event?.args },
    ...event,
  }
}

/**
 * Creates module event with ready-to-go-defaults
 */
export function ModuleEvent (res: Module, event?: Partial<Event>): Event {
  return {
    eventType: onManual,
    resourceType: res.resourceType,
    match: (c) => namespaceMatcher(res.namespace, c, moduleMatcher(res, c, false)),
    args: { module: res, ...event?.args },
    ...event,
  }
}

/**
 * Creates record event with ready-to-go-defaults
 */
export function RecordEvent (res: Record, event?: Partial<Event>): Event {
  return {
    eventType: onManual,
    resourceType: res.resourceType,
    match: (c) => namespaceMatcher(res.namespace, c, moduleMatcher(res.module, c, false)),
    args: { record: res, ...event?.args },
    ...event,
  }
}

export async function TriggerComposeScriptOnManual (api: TriggerEndpoints, ev: Event, script: string): Promise<object|Record> {
  const params = { script, args: ev.args }
  const { namespaceID } = ev.args?.namespace as Namespace
  const { moduleID } = ev.args?.module as Module
  const { recordID } = ev.args?.record as Record

  switch (ev.resourceType) {
    case 'compose':
      return api.automationTriggerScript({ ...params })

    case 'compose:namespace':
      return api.namespaceTriggerScript({ namespaceID, ...params }).then(rval => new Namespace(rval))

    case 'compose:module':
      return api.moduleTriggerScript({ moduleID, ...params }).then(rval => new Module(rval))

    case 'compose:record':
      return api.recordTriggerScript({ recordID, ...params }).then(rval => new Record(rval))

    default:
      throw Error(`cannot trigger server script: unknown resource type '${ev.resourceType}'`)
  }
}
