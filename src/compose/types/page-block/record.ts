import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'Record'

interface Options {
  fields: unknown[];
  refreshRate: number;
}

const defaults: Readonly<Options> = Object.freeze({
  fields: [],
  refreshRate: 0
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
    Apply(this.options, o, Number, 'refreshRate')
    if (o.fields) {
      this.options.fields = o.fields
    }
  }
}

Registry.set(kind, PageBlockRecord)
