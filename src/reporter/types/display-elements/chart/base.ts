import { DisplayElement, DisplayElementInput, Registry } from '../base'
import { DefinitionOptions, FrameDefinition } from '../../frame'
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
  public datasources: Array<FrameDefinition> = []

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

  reportDefinitions (definition: DefinitionOptions): { dataframes: Array<FrameDefinition> } {
    if (typeof this.options.source === 'object') {
      // @todo allow implicit sources
      throw new Error('chart source must be provided as a reference')
    }

    const dataframes: Array<FrameDefinition> = []

    this.options.datasources.forEach(({ name = '', filter, sort }) => {
      const df: FrameDefinition = {
        name: this.name,
        source: this.options.source,
        ref: name,
        filter,
        sort,
      }

      const relatedDefinition = definition[name]

      if (relatedDefinition) {
        df.sort = (relatedDefinition.sort ? relatedDefinition.sort : sort) || undefined

        if (relatedDefinition.filter && relatedDefinition.filter?.ref) {
          // If element and scenario have filter AND them together
          if (filter && filter.ref) {
            df.filter = {
              ref: 'and',
              args: [
                filter,
                relatedDefinition.filter,
              ]
            }
          } else {
            df.filter = relatedDefinition.filter
          }
        }
      }

      dataframes.push(df)
    })

    return { dataframes }
  }
}

Registry.set(kind, DisplayElementChart)
