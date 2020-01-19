import { Event, GenericEventMaker, onManual } from '../../eventbus/shared'
import { Role } from '../types/role'

export function SystemEvent (eventType = onManual): Event {
  return GenericEventMaker({ resourceType: 'system' }, eventType, () => true, {})
}
