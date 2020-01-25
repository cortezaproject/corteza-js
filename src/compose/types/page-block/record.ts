import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'Record'

interface Options {
  moduleID: string;
  fields: unknown[];
}

const defaults: Readonly<Options> = Object.freeze({
  moduleID: NoID,
  fields: [],
})

export class PageBlockRecord extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')

    if (o.fields) {
      this.options.fields = o.fields
    }
  }
}

Registry.set(kind, PageBlockRecord)
