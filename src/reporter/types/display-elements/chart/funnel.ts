import { ChartOptions, ChartOptionsInput, ChartOptionsRegistry } from './base'
import { Apply } from '../../../../cast'

export class FunnelChartOptions extends ChartOptions {
  public test: string = ''

  constructor (o?: FunnelChartOptions | Partial<FunnelChartOptions>) {
    super(o)

    if (!o) return

    Apply(this, o, String, 'test')
  }
}

ChartOptionsRegistry.set('funnel', FunnelChartOptions)

