import { DisplayElement, DisplayElementInput, Registry } from '../base'
import { FrameDefinition } from '../../frame'
import { Apply } from '../../../../cast'

const kind = 'Chart'

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

export type PartialChartOptions = Partial<ChartOptions>
export type ChartOptionsInput = ChartOptions | PartialChartOptions
export const ChartOptionsRegistry = new Map<string, typeof ChartOptions>()

export class ChartOptions {
  public type = 'bar'
  public colorScheme = ''
  public source = ''
  public datasources = []

  constructor (o: PartialChartOptions = {}) {
    if (!o) return

    Apply(this, o, String, 'type', 'colorScheme', 'source')

    if (o.datasources) {
      this.datasources = o.datasources
    }
  }
}


export class DisplayElementChart extends DisplayElement {
  readonly kind = kind

  options: ChartOptions = ChartOptionsMaker({ type: 'bar' })

  constructor (i?: DisplayElementInput) {
    super(i)
    this.applyOptions(i?.options as Partial<ChartOptions>)
  }

  applyOptions (o?: PartialChartOptions): void {
    if (!o) return

    this.options = ChartOptionsMaker(o)
  }

  reportDefinitions (definition: FrameDefinition = {}): { dataframes: Array<FrameDefinition> } {
    if (typeof this.options.source === 'object') {
      // @todo allow implicit sources
      throw new Error('chart source must be provided as a reference')
    }

    const dataframes: Array<FrameDefinition> = []

    this.options.datasources.map(({ name, filter, sort }) => {
      dataframes.push({
        name: this.name,
        source: this.options.source,
        ref: name,
        sort: (definition.sort ? definition.sort : sort) || undefined,
        filter,
      })
    })

    return { dataframes }
  }
}

Registry.set(kind, DisplayElementChart)
