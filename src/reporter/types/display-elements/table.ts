import { DisplayElement, DisplayElementInput, Registry } from './base'
import { FrameDefinition, FrameColumn } from '../frame'
import { Apply } from '../../../cast'

const kind = 'Table'

interface TableColumns {
  [key: string]: Array<FrameColumn>;
}

interface Options {
  source?: string;
  datasources: Array<FrameDefinition>;

  columns?: TableColumns;

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

  columns: {},

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

    this.options.datasources.map(({ name, filter, sort, paging }) => {
      const df: FrameDefinition = {
        name: this.name,
        source: this.options.source,
        ref: name,
        filter,
        sort,
        paging,
      }

      if (name === definition.ref) {
        df.sort = (definition.sort ? definition.sort : sort) || undefined

        if (definition.paging || paging) {
          df.paging = { ...(paging || {}), ...(definition.paging || {}) }
        }
      }

      if (df.paging?.limit) {
        df.paging.limit = parseInt((df.paging.limit as any))
      }

      dataframes.push(df)
    })

    return { dataframes }
  }
}

Registry.set(kind, DisplayElementTable)
