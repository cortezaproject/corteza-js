import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { IsOf, AreStrings } from '../../guards'

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
  public labels: object = {}
  public createdAt?: Date = undefined
  public updatedAt?: Date = undefined
  public deletedAt?: Date = undefined
  public suspendedAt?: Date = undefined
  public roles?: Array<string>

  constructor (u?: PartialUser) {
    this.apply(u)
  }

  apply (u?: PartialUser): void {
    Apply(this, u, CortezaID, 'userID')
    Apply(this, u, String, 'handle', 'username', 'email', 'name')
    Apply(this, u, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt', 'suspendedAt')

    if (u?.roles) {
      this.roles = []
      if (AreStrings(u.roles)) {
        this.roles = u.roles
      }
    }

    if (IsOf(u, 'labels')) {
      this.labels = { ...u.labels }
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
