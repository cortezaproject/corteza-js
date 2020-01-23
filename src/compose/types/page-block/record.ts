import { PageBlock, RawPageBlock, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'Record'

interface Options {
  moduleID: string;
  fields: unknown[];
}

export class PageBlockRecord extends PageBlock {
  readonly kind = kind

  options: Options = {
    moduleID: NoID,
    fields: [],
  }

  constructor (i?: PageBlock | RawPageBlock) {
    super(i)
    this.applyOptions(i?.options as Options)
  }

  applyOptions (o?: Options): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')

    if (o.fields) {
      this.options.fields = o.fields
    }
  }
}

Registry.set(kind, PageBlockRecord)
