import { DisplayElement, DisplayElementInput, Registry } from './base'
import { FrameDefinition } from '../frame'
import { Apply } from '../../../cast'

const kind = 'Table'

interface TableColumn {
  name: string;
  label?: string;
}

interface DatasourceColumns {
  name: string;
  columns: Array<TableColumn>;
}

interface Options {
  source?: string;
  datasources: Array<FrameDefinition>;

  columns?: Array<DatasourceColumns>;

  striped: boolean;
  bordered: boolean;
  borderless: boolean;
  small: boolean;
  hover: boolean;
  dark: boolean;
  fixed: boolean;
  responsive: boolean;
  noCollapse: boolean;
  headVariant: string | null;
  tableVariant: string;
}

const defaults: Readonly<Options> = Object.freeze({
  source: '',
  datasources: [],

  columns: [],

  striped: false,
  bordered: false,
  borderless: false,
  small: false,
  hover: false,
  dark: false,
  fixed: false,
  responsive: true,
  noCollapse: false,
  headVariant: null,
  tableVariant: 'light',
})

export class DisplayElementTable extends DisplayElement {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: DisplayElementInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'headVariant', 'tableVariant', 'source')

    Apply(this.options, o, Boolean,
      'striped',
      'bordered',
      'borderless',
      'small',
      'hover',
      'dark',
      'fixed',
      'responsive',
      'noCollapse',
    )

    if (o.datasources) {
      this.options.datasources = o.datasources || []
    }

    if (o.columns) {
      this.options.columns = o.columns || []
    }
  }

  reportDefinitions (definition: FrameDefinition = {}): { dataframes: Array<FrameDefinition> } {
    if (typeof this.options.source === 'object') {
      // @todo allow implicit sources
      throw new Error('table source must be provided as a reference')
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

Registry.set(kind, DisplayElementTable)
