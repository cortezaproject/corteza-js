import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { AreStrings } from '../../guards'

interface RawRole {
  roleID?: string;
  name?: string;
  handle?: string;
  members?: string[];
  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
  archivedAt?: string|number|Date;
}

export class Role {
  public roleID = NoID
  public name = ''
  public handle = ''
  public members: string[] = []
  public createdAt?: Date = undefined
  public updatedAt?: Date = undefined
  public deletedAt?: Date = undefined
  public archivedAt?: Date = undefined

  constructor (c?: RawRole | Role) {
    this.apply(c)
  }

  apply (c?: RawRole | Role): void {
    Apply(this, c, CortezaID, 'roleID')

    Apply(this, c, String, 'name', 'handle')

    if (c?.members) {
      this.members = []
      if (AreStrings(c.members)) {
        this.members = c.members
      }
    }

    Apply(this, c, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt', 'archivedAt')
  }
}
