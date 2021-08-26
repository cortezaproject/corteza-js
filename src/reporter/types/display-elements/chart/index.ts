import { DisplayElementChart, ChartOptions, ChartOptionsRegistry } from './base'
export { BasicChartOptions } from './basic'
export { FunnelChartOptions } from './funnel'

export function ChartOptionsMaker<T extends ChartOptions> (options: Partial<ChartOptions>): T {
  const { type } = options

  if (type){
    const ChartOptionsTemp = ChartOptionsRegistry.get(type)
    if (ChartOptionsTemp === undefined) {
      throw new Error(`unknown chart type '${type}'`)
    }

    if (options instanceof ChartOptions) {
      // Get rid of the references
      options = JSON.parse(JSON.stringify(options))
    }

    return new ChartOptionsTemp(options) as T
  } else {
    throw new Error(`no chart type`)
  }
}

export {
  ChartOptionsRegistry,
  DisplayElementChart,
}
