import { DisplayElement, DisplayElementInput, Registry } from './base'
import { FrameDefinition } from '../frame'
import { Apply } from '../../../cast'

const kind = 'Metric'

interface Options {
  source?: string;
  datasources: Array<FrameDefinition>;

  valueColumn: string;

  format: string;
  prefix: string;
  suffix: string;

  color: string;
  backgroundColor: string;
}

const defaults: Readonly<Options> = Object.freeze({
  source: '',
  datasources: [],

  valueColumn: '',

  format: '',
  prefix: '',
  suffix: '',

  color: '#000000',
  backgroundColor: '#ffffff',
})

export class DisplayElementMetric extends DisplayElement {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: DisplayElementInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'source', 'valueColumn', 'format', 'prefix', 'suffix', 'color', 'backgroundColor')

    if (o.datasources) {
      this.options.datasources = o.datasources || []
    }
  }

  reportDefinitions (definition: FrameDefinition = {}): { dataframes: Array<FrameDefinition> } {
    if (typeof this.options.source === 'object') {
      // @todo allow implicit sources
      throw new Error('metric source must be provided as a reference')
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

Registry.set(kind, DisplayElementMetric)
