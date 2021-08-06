import { Apply } from '../../cast'
import { FrameDefinition } from './frame'
import { Step } from './step'
import { RowDefinition } from './filter'

export interface Element {
  name: string;
  description?: string;
  kind: string;
  variant?: string;
  options?: unknown;

  reportDefinitions?: (datamodel?: Array<Step>, definition?: Partial<FrameDefinition>) => { dataframes: Array<FrameDefinition> };
}

interface SourceDefinition {
  name: string;
  definition: { [key: string]: string };
  rows?: RowDefinition;
}

export class ElementText implements Element {
  public name = ''
  public description = ''
  public kind = ''
  value = 'Sample text...'

  constructor (p: ElementText) {
    Apply(this, p, String, 'name', 'description', 'kind', 'value')

    this.kind = 'Text'
  }
}

interface ChartOptions {
  source?: string|SourceDefinition;
  sort?: string;

  chartType?: string;
  labelColumn: string;
  dataColumns: Array<{ name: string; label?: string }>;

  // // things to transform the data
  // // @todo provide an array of these so we can control their order and stuff?
  // transform?: Partial<StepTransform>;
  // group?: Partial<StepGroup>;
}

export class ElementChart implements Element {
  public name = ''
  public description = ''
  public kind = ''
  public options: ChartOptions = {
    source: '',
    sort: '',

    chartType: 'bar',
    labelColumn: '',
    dataColumns: [],
  }

  constructor (p: ElementChart) {
    Apply(this, p, String, 'name', 'description', 'kind')
    this.applyOptions(p?.options as Partial<ChartOptions>)

    this.kind = 'Chart'
  }

  applyOptions (o?: Partial<ChartOptions>): void {
    if (!o) return

    Apply(this.options, o, String, 'chartType', 'labelColumn', 'source')

    this.options.dataColumns = o.dataColumns || []
  }

  reportDefinitions (datamodel: Array<Step> = [], definition: FrameDefinition = {}): { dataframes: Array<FrameDefinition> } {
    if (typeof this.options.source === 'object') {
      // @todo allow implicit sources
      throw new Error('chart source must be provided as a reference')
    }

    let sort = definition.sort ? definition.sort : this.options.sort || ''

    const f: FrameDefinition = {
      name: this.name,
      source: this.options.source,
      sort: sort || undefined,
    }

    return {
      dataframes: [f],
    }
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

interface TableOptions {
  source?: string|SourceDefinition;
  columns?: Array<TableColumn>;
  sort?: string;

  // // things to transform the data
  // // @todo provide an array of these so we can control their order and stuff?
  // transform?: Partial<StepTransform>;
  // group?: Partial<StepGroup>;

  // // relationships define how the two tables are joined.
  // // the original table (local table) defines this.
  // relationships?: Array<{ column: string; refTable: string; refColumn: string }>;

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
  public options: TableOptions = {
    source: '',
    columns: [],
    sort: '',

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

    this.kind = 'Table'
  }

  applyOptions (o?: Partial<TableOptions>): void {
    if (!o) return

    Apply(this.options, o, String, 'headVariant', 'tableVariant', 'source', 'sort')

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

    let sort = definition.sort ? definition.sort : this.options.sort || ''

    // when the source is joined, we need to send multiple frame definitions
    const s = datamodel.filter(({ join }) => !!join).find(({ join }) => join && join.name === this.options.source)
    if (!s) {
      return {
        dataframes: [{
          name: this.name,
          source: this.options.source,
          sort: sort || undefined,
        }],
      }
    }

    return {
      dataframes: [
        {
          name: this.name,
          source: this.options.source,
          ref: s.join?.localSource,
        },
        {
          name: this.name,
          source: this.options.source,
          ref: s.join?.foreignSource,
        }
      ],
    }
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
