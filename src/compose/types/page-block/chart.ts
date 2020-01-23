import { PageBlock, RawPageBlock, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'

const kind = 'Chart'

interface Options {
  chartID: string;
}

export class PageBlockChart extends PageBlock {
  readonly kind = kind

  options: Options = {
    chartID: NoID,
  }

  constructor (i?: PageBlock | RawPageBlock) {
    super(i)
    this.applyOptions(i?.options as Options)
  }

  applyOptions (o?: Options): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'chartID')
  }
}

Registry.set(kind, PageBlockChart)
