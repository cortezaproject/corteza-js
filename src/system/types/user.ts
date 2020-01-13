import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'

interface RawUser {
  userID?: string;
  handle?: string;
  username?: string;
  email?: string;
  name?: string;
  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
  archivedAt?: string|number|Date;
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

  constructor (c?: RawUser | User) {
    this.apply(c)
  }

  apply (c?: RawUser | User): void {
    Apply(this, c, CortezaID, 'userID')
    Apply(this, c, String, 'handle', 'username', 'email', 'name')
    Apply(this, c, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt', 'suspendedAt')
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
