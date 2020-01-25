import { ModuleField, ModuleFieldMaker } from './module-field'
import { CortezaID, NoID, ISO8601Date, Apply } from '../../cast'
import { AreObjects, AreObjectsOf, AreStrings, IsOf } from '../../guards'
import { PageBlock, PageBlockMaker } from './page-block'

interface MetaAdminRecordList {
  columns: string[];
}

interface MetaAdmin {
  recordList: MetaAdminRecordList;
}

interface Meta {
  admin: MetaAdmin;
}

/**
 * System fields that are present in every object.
 */
export const systemFields = Object.freeze([
  { name: 'ownedBy', label: 'Owned by', kind: 'User' },
  { name: 'createdBy', label: 'Created by', kind: 'User' },
  { name: 'createdAt', label: 'Created at', kind: 'DateTime' },
  { name: 'updatedBy', label: 'Updated by', kind: 'User' },
  { name: 'updatedAt', label: 'Updated at', kind: 'DateTime' },
  { name: 'deletedBy', label: 'Deleted by', kind: 'User' },
  { name: 'deletedAt', label: 'Deleted at', kind: 'DateTime' },
].map(f => new ModuleField({
  ...f,
  isSystem: true,
})))

interface PartialModule extends Partial<Omit<Module, 'fields' | 'meta' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
  fields?: Array<Partial<ModuleField>> | Array<ModuleField>;
  meta?: Partial<Meta>;

  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
}

export class Module {
  public moduleID = NoID;
  public namespaceID = NoID;
  public name = '';
  public handle = '';
  public fields: Array<ModuleField> = [];
  public meta: object = {};

  public createdAt?: Date = undefined;
  public updatedAt?: Date = undefined;
  public deletedAt?: Date = undefined;

  public canUpdateModule = false;
  public canDeleteModule = false;
  public canCreateRecord = false;
  public canReadRecord = false;
  public canUpdateRecord = false;
  public canDeleteRecord = false;
  public canGrant = false;

  constructor (i?: PartialModule) {
    this.apply(i)
  }

  clone (): Module {
    return new Module(JSON.parse(JSON.stringify(this)))
  }

  apply (m?: PartialModule): void {
    if (!m) return

    Apply(this, m, CortezaID, 'moduleID', 'namespaceID')
    Apply(this, m, String, 'name', 'handle')

    if (IsOf(m, 'fields')) {
      this.fields = []
      if (AreObjects(m.fields)) {
        // We're very permissive here -- array of (empty) objects is all we need
        // to create fields.
        this.fields = m.fields.map((b: { kind?: string }) => ModuleFieldMaker(b))
      }
    }

    if (IsOf(m, 'meta')) {
      this.meta = { ...m.meta }
    }

    Apply(this, m, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, m, Boolean,
      'canUpdateModule',
      'canDeleteModule',
      'canCreateRecord',
      'canReadRecord',
      'canUpdateRecord',
      'canDeleteRecord',
      'canGrant',
    )
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.moduleID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'compose:module'
  }

  /**
   * Returns fields from module, filtered and order as requested
   */
  filterFields (requested?: string[] | Array<ModuleField>): Array<ModuleField> {
    if (!requested || requested.length === 0) {
      return []
    }

    if (!AreStrings(requested)) {
      requested = (requested as ModuleField[]).map((f: ModuleField) => f.name)
    }

    const out: ModuleField[] = []

    for (const r of requested) {
      const sf = this.systemFields().find(f => r === f.name)
      if (sf) {
        out.push(sf)
        continue
      }

      const mf = this.fields.find(f => r === f.name)
      if (mf) {
        out.push(mf)
      }
    }

    return out
  }

  public findField (name: string): ModuleField|undefined {
    const r = this.filterFields([name])
    return r && r.length > 0 ? r[0] : undefined
  }

  fieldNames (): readonly string[] {
    return this.fields.map(f => f.name)
  }

  systemFields (): readonly ModuleField[] {
    return systemFields
  }

  export (): Module {
    return this
  }

  import (): Module {
    return this
  }
}
