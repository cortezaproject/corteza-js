import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { AreStrings } from '../../guards'

interface PartialUser extends Partial<Omit<User, 'createdAt' | 'updatedAt' | 'deletedAt' | 'suspendedAt'>> {
  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
  suspendedAt?: string|number|Date;
}

export class User {
  public userID = NoID
  public handle = ''
  public username = ''
  public email = ''
  public name = ''
  public createdAt?: Date = undefined
  public updatedAt?: Date = undefined
  public deletedAt?: Date = undefined
  public suspendedAt?: Date = undefined
  public roles?: Array<string>

  constructor (c?: PartialUser) {
    this.apply(c)
  }

  apply (c?: PartialUser): void {
    Apply(this, c, CortezaID, 'userID')
    Apply(this, c, String, 'handle', 'username', 'email', 'name')
    Apply(this, c, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt', 'suspendedAt')

    if (c?.roles) {
      this.roles = []
      if (AreStrings(c.roles)) {
        this.roles = c.roles
      }
    }
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.userID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'system:user'
  }

  get fts (): string {
    return [
      this.name,
      this.username,
      this.handle,
      this.email,
      this.userID,
    ].join(' ').toLocaleLowerCase()
  }
}
