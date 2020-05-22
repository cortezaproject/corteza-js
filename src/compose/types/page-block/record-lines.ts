import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'RecordLines'
interface Options {
  moduleID: string;
  fieldsView?: Array<string>;
  fieldsEdit?: Array<string>;
  positionField: string;
  parentField: string;
}

const defaults: Readonly<Options> = Object.freeze({
  moduleID: NoID,
  fieldsView: undefined,
  fieldsEdit: undefined,
  positionField: '',
  parentField: '',
})

export class PageBlockRecordLines extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')

    Apply(this.options, o, String, 'positionField', 'parentField')

    if (o.fieldsView) {
      this.options.fieldsView = o.fieldsView
    }
    if (o.fieldsEdit) {
      this.options.fieldsEdit = o.fieldsEdit
    }
  }
}

Registry.set(kind, PageBlockRecordLines)
