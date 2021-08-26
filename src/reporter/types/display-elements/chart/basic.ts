import { ChartOptions, ChartOptionsRegistry } from './base'
import { Apply } from '../../../../cast'

export class BasicChartOptions extends ChartOptions {
  public labelColumn: string = ''
  public dataColumns: Array<{ name: string; label?: string }> = []

  constructor (o?: BasicChartOptions | Partial<BasicChartOptions>) {
    super(o)

    if (!o) return

    Apply(this, o, String, 'labelColumn')

    if (o.dataColumns) {
      this.dataColumns = o.dataColumns || []
    }
  }
}

ChartOptionsRegistry.set('bar', BasicChartOptions)
ChartOptionsRegistry.set('line', BasicChartOptions)
ChartOptionsRegistry.set('pie', BasicChartOptions)
ChartOptionsRegistry.set('doughnut', BasicChartOptions)

