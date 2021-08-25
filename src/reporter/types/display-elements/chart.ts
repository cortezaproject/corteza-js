import { DisplayElement, DisplayElementInput, Registry } from './base'
import { FrameDefinition } from '../frame'
import { Apply } from '../../../cast'

const kind = 'Chart'

interface Options {
  source?: string;
  datasources: Array<FrameDefinition>;

  labelColumn: string;
  dataColumns: Array<{ name: string; label?: string }>;

  chartType?: string;
  colorScheme?: string;
}

const defaults: Readonly<Options> = Object.freeze({
  source: '',
  datasources: [],

  labelColumn: '',
  dataColumns: [],

  chartType: 'bar',
  colorScheme: '',
})

export class DisplayElementChart extends DisplayElement {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: DisplayElementInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'chartType', 'labelColumn', 'source', 'colorScheme')

    if (o.datasources) {
      this.options.datasources = o.datasources || []
    }

    if (o.dataColumns) {
      this.options.dataColumns = o.dataColumns || []
    }
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
