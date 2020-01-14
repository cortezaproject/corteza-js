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
 * cortezaTypes map helps ExecArgs class with translation of (special) arguments
 * to their respected types
 *
 * There's noe need to set/define casters for old* arguments,
 * It's auto-magically done by Args class
 */
export const cortezaTypes: Caster = new Map()

cortezaTypes.set('authUser', GenericCasterFreezer(User))
cortezaTypes.set('invoker', GenericCasterFreezer(User))
cortezaTypes.set('module', GenericCaster(Module))
cortezaTypes.set('oldModule', GenericCasterFreezer(Module))
cortezaTypes.set('page', GenericCaster(Page))
cortezaTypes.set('oldPage', GenericCasterFreezer(Page))
cortezaTypes.set('namespace', GenericCaster(Namespace))
cortezaTypes.set('oldNamespace', GenericCasterFreezer(Namespace))
cortezaTypes.set('application', GenericCaster(Application))
cortezaTypes.set('oldApplication', GenericCasterFreezer(Application))
cortezaTypes.set('user', GenericCaster(User))
cortezaTypes.set('oldUser', GenericCasterFreezer(User))
cortezaTypes.set('role', GenericCaster(Role))
cortezaTypes.set('oldRole', GenericCasterFreezer(Role))
cortezaTypes.set('channel', GenericCaster(Channel))
cortezaTypes.set('oldChannel', GenericCasterFreezer(Channel))
cortezaTypes.set('message', GenericCaster(Message))
cortezaTypes.set('oldMessage', GenericCasterFreezer(Message))
cortezaTypes.set('record', recordCaster)
cortezaTypes.set('oldRecord', recordCasterFreezer)
