import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { IsOf, AreStrings } from '../../guards'

interface PartialRole extends Partial<Omit<Role, 'createdAt' | 'updatedAt' | 'deletedAt' | 'archivedAt'>> {
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
  public labels: object = {}
  public createdAt?: Date = undefined
  public updatedAt?: Date = undefined
  public deletedAt?: Date = undefined
  public archivedAt?: Date = undefined

  constructor (r?: PartialRole) {
    this.apply(r)
  }

  apply (r?: PartialRole): void {
    Apply(this, r, CortezaID, 'roleID')

    Apply(this, r, String, 'name', 'handle')

    if (r?.members) {
      this.members = []
      if (AreStrings(r.members)) {
        this.members = r.members
      }
    }

    if (IsOf(r, 'labels')) {
      this.labels = { ...r.labels }
    }

    Apply(this, r, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt', 'archivedAt')
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.roleID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'system:role'
  }
}
