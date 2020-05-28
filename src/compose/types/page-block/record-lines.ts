import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'RecordLines'
interface Options {
  moduleID: string;
  viewFields?: Array<string>;
  editFields?: Array<string>;
  positionField?: string;
  parentField?: string;
}

const defaults: Readonly<Options> = Object.freeze({
  moduleID: NoID,
  viewFields: undefined,
  editFields: undefined,
  positionField: undefined,
  parentField: undefined,
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

    if (o.viewFields) {
      this.options.viewFields = o.viewFields
    }
    if (o.editFields) {
      this.options.editFields = o.editFields
    }
  }
}

Registry.set(kind, PageBlockRecordLines)
