import { Event, GenericEventMaker, onManual } from '../../eventbus/shared'
import { User } from '../types/user'

export function UserEvent (user: User, eventType: string = onManual): Event {
  return GenericEventMaker(user, eventType, function (c) {
    switch (c.Name()) {
      case 'user':
      case 'user.handle':
        return c.Match(user.handle)
      case 'user.email':
        return c.Match(user.email)
    }

    return false
  }, { user })
}
