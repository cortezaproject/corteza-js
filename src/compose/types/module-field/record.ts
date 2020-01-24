// @todo option to allow multiple entries
// @todo option to allow duplicates
import { ModuleField, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'Record'

interface Options {
  moduleID: string;
  labelField: string;
  queryFields: string;
  selectType: string;
  multiDelimiter: string;
}

const defaults: Options = {
  moduleID: NoID,
  labelField: '',
  queryFields: '',
  selectType: '',
  multiDelimiter: '\n',
}

export class ModuleFieldRecord extends ModuleField {
  readonly kind = kind

  options: Options = defaults

  constructor (i?: Partial<ModuleFieldRecord>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')
    Apply(this.options, o, String, 'labelField', 'queryFields', 'selectType', 'multiDelimiter')
  }
}

Registry.set(kind, ModuleFieldRecord)
