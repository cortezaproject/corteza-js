/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { Caster, GenericCaster, GenericCasterFreezer } from './args'
import { User } from '../system/types/user'
import { Module } from '../compose/types/module'
import { Page } from '../compose/types/page'
import { Namespace } from '../compose/types/namespace'
import { Application } from '../system/types/application'
import { Role } from '../system/types/role'
import { Channel } from '../messaging/types/channel'
import { Message } from '../messaging/types/message'
import { Record } from '../compose/types/record'

interface RecordCasterCaller {
  $module: Module;
}

/**
 * Record type caster
 *
 * Record arg is a bit special, it takes 2 params (record itself + record's module)
 */
function recordCaster (this: RecordCasterCaller, val: unknown): Record {
  return new Record(this.$module, val as any)
}

function recordCasterFreezer (this: RecordCasterCaller, val: unknown): Readonly<Record> {
  return Object.freeze(new Record(this.$module, val as any))
}

/**
 * CortezaTypes map helps ExecArgs class with translation of (special) arguments
 * to their respected types
 *
 * There's noe need to set/define casters for old* arguments,
 * It's auto-magically done by Args class
 */
export const CortezaTypes: Caster = new Map()

CortezaTypes.set('authUser', GenericCasterFreezer(User))
CortezaTypes.set('invoker', GenericCasterFreezer(User))
CortezaTypes.set('module', GenericCaster(Module))
CortezaTypes.set('oldModule', GenericCasterFreezer(Module))
CortezaTypes.set('page', GenericCaster(Page))
CortezaTypes.set('oldPage', GenericCasterFreezer(Page))
CortezaTypes.set('namespace', GenericCaster(Namespace))
CortezaTypes.set('oldNamespace', GenericCasterFreezer(Namespace))
CortezaTypes.set('application', GenericCaster(Application))
CortezaTypes.set('oldApplication', GenericCasterFreezer(Application))
CortezaTypes.set('user', GenericCaster(User))
CortezaTypes.set('oldUser', GenericCasterFreezer(User))
CortezaTypes.set('role', GenericCaster(Role))
CortezaTypes.set('oldRole', GenericCasterFreezer(Role))
CortezaTypes.set('channel', GenericCaster(Channel))
CortezaTypes.set('oldChannel', GenericCasterFreezer(Channel))
CortezaTypes.set('message', GenericCaster(Message))
CortezaTypes.set('oldMessage', GenericCasterFreezer(Message))
CortezaTypes.set('record', recordCaster)
CortezaTypes.set('oldRecord', recordCasterFreezer)
