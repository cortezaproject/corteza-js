import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { IsOf } from '../../guards'
import { Module } from './module'

interface MetaAdminRecordList {
  columns: string[];
}

interface MetaAdmin {
  recordList: MetaAdminRecordList;
}

interface Meta {
  subtitle: string;
  description: string;
}

interface PartialNamespace extends Partial<Omit<Namespace, 'meta' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
  meta?: Partial<Meta>;
  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
}

export class Namespace {
  public namespaceID = NoID
  public name = ''
  public slug = ''
  public enabled = false

  public meta: object = {}

  public createdAt?: Date = undefined;
  public updatedAt?: Date = undefined;
  public deletedAt?: Date = undefined;

  public canCreateChart = false
  public canCreateModule = false
  public canCreatePage = false
  public canDeleteNamespace = false
  public canUpdateNamespace = false
  public canManageNamespace = false
  public canGrant = false

  constructor (i?: PartialNamespace) {
    this.apply(i)
  }

  clone (): Namespace {
    return new Namespace(JSON.parse(JSON.stringify(this)))
  }

  apply (n?: PartialNamespace | Namespace): void {
    if (!n) return

    Apply(this, n, CortezaID, 'namespaceID')
    Apply(this, n, String, 'name', 'slug')

    Apply(this, n, Boolean, 'enabled')

    if (IsOf(n, 'meta')) {
      this.meta = { ...n.meta }
    }

    Apply(this, n, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, n, Boolean,
      'canCreateChart',
      'canCreateModule',
      'canCreatePage',
      'canDeleteNamespace',
      'canUpdateNamespace',
      'canManageNamespace',
      'canGrant',
    )
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.namespaceID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'compose:namespace'
  }
}
