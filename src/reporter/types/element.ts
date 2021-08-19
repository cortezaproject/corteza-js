import { Apply } from '../../cast'
import { IsOf } from '../../guards'
import { FrameDefinition } from './frame'
import { Step } from './step'
import { FilterDefinition } from './filter'


interface Meta {
  size?: number;
}

interface DatasourceConfiguration {
  name: string;
  sort?: string;
  filter?: FilterDefinition;
}

export interface Element {
  name: string;
  description?: string;
  kind: string;
  variant?: string;
  options?: unknown;

  meta: Meta;

  reportDefinitions?: (datamodel?: Array<Step>, definition?: Partial<FrameDefinition>) => { dataframes: Array<FrameDefinition> };
}

export class ElementText implements Element {
  public name = ''
  public description = ''
  public kind = ''
  public meta = {
    size: undefined,
  }

  value = 'Sample text...'

  constructor (p: ElementText) {
    Apply(this, p, String, 'name', 'description', 'kind', 'value')

    if (p && IsOf(p, 'meta')) {
      this.meta = p.meta
    }

    this.kind = 'Text'
  }
}

interface ChartOptions {
  source?: string;
  datasources: Array<DatasourceConfiguration>;

  labelColumn: string;
  dataColumns: Array<{ name: string; label?: string }>;

  chartType?: string;
  colorScheme?: string;
}

export class ElementChart implements Element {
  public name = ''
  public description = ''
  public kind = ''
  public meta = {
    size: undefined,
  }

  public options: ChartOptions = {
    source: '',
    datasources: [],

    labelColumn: '',
    dataColumns: [],

    chartType: 'bar',
    colorScheme: '',
  }

  constructor (p: ElementChart) {
    Apply(this, p, String, 'name', 'description', 'kind')
    this.applyOptions(p?.options as Partial<ChartOptions>)

    if (p && IsOf(p, 'meta')) {
      this.meta = p.meta
    }

    this.kind = 'Chart'
  }

  applyOptions (o?: Partial<ChartOptions>): void {
    if (!o) return

    this.options.datasources = o.datasources || []

    Apply(this.options, o, String, 'chartType', 'labelColumn', 'source', 'colorScheme')

    this.options.dataColumns = o.dataColumns || []
  }

  reportDefinitions (datamodel: Array<Step> = [], definition: FrameDefinition = {}): { dataframes: Array<FrameDefinition> } {
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

  get elementKey (): string {
    return `[${this.name}]`
  }
}

// // // // // // // // // // // // // // // // // // // // // // // // //


interface TableColumn {
  name: string;
  label?: string;
}

interface DatasourceColumns {
  name: string;
  columns: Array<TableColumn>;
}

interface TableOptions {
  source?: string;
  datasources: Array<DatasourceConfiguration>;

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

export class ElementTable implements Element {
  public name = ''
  public description = ''
  public kind = ''
  public variant = ''
  public meta = {
    size: undefined,
  }

  public options: TableOptions = {
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
  }

  constructor (p: Partial<ElementTable>) {
    Apply(this, p, String, 'name', 'description', 'kind', 'variant')
    this.applyOptions(p?.options as Partial<TableOptions>)

    if (p && IsOf(p, 'meta')) {
      this.meta = p.meta
    }

    this.kind = 'Table'
  }

  applyOptions (o?: Partial<TableOptions>): void {
    if (!o) return

    this.options.datasources = o.datasources || []

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

    this.options.columns = o.columns || []
  }

  reportDefinitions (datamodel: Array<Step> = [], definition: FrameDefinition = {}): { dataframes: Array<FrameDefinition> } {
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

  get elementKey (): string {
    return `[${this.name}]`
  }
}

// // // // // // // // // // // // // // // // // // // // // // // // //

export class ElementFactory {
  public static Make (e: Partial<Element>): Element {
    switch (e.kind) {
      case 'Text':
        return ElementFactory.MakeText(e as ElementText)
      case 'Table':
        return ElementFactory.MakeTable(e as ElementTable)
      case 'Chart':
        return ElementFactory.MakeChart(e as ElementChart)
      default:
        throw new Error('unknown display element: ' + e.kind)
    }
  }

  public static MakeText (e: ElementText): ElementText {
    return new ElementText(e)
  }

  public static MakeTable (e: ElementTable): ElementTable {
    return new ElementTable(e)
  }

  public static MakeChart (e: ElementChart): ElementChart {
    return new ElementChart(e)
  }
}
