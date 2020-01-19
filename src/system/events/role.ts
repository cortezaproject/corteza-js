import { Event, GenericEventMaker, onManual } from '../../eventbus/shared'
import { Role } from '../types/role'

export function RoleEvent (role: Role, eventType = onManual): Event {
  return GenericEventMaker(role, eventType, function (c) {
    switch (c.Name()) {
      case 'role':
      case 'role.handle':
        return c.Match(role.handle)
      case 'role.name':
        return c.Match(role.name)
    }

    return false
  }, { role })
}
