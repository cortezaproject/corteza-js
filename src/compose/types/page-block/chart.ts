import { PageBlock, PageBlockInput, Registry } from './base'
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

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'chartID')
  }
}

Registry.set(kind, PageBlockChart)
