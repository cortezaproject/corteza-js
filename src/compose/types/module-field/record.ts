// @todo option to allow multiple entries
// @todo option to allow duplicates
import { ModuleField, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'Record'

interface Options {
  moduleID: string;
  labelField: string;
  queryFields: Array<string>;
  selectType: string;
  multiDelimiter: string;
}

const defaults: Readonly<Options> = Object.freeze({
  moduleID: NoID,
  labelField: '',
  queryFields: [],
  selectType: '',
  multiDelimiter: '\n',
})

export class ModuleFieldRecord extends ModuleField {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: Partial<ModuleFieldRecord>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')
    Apply(this.options, o, String, 'labelField', 'selectType', 'multiDelimiter')
    Apply(this.options, o, (o) => {
      if (!o) {
        return []
      }
      if (!Array.isArray(o)) {
        return [o]
      }
      return o
    }, 'queryFields')
  }
}

Registry.set(kind, ModuleFieldRecord)
