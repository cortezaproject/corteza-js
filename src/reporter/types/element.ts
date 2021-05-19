import { Apply } from '../../cast'
import { DatasetDefinition } from './dataset'
import { Step, RowDefinition, StepGroup, StepTransform, StepFactory } from './step'

export interface Element {
  name: string;
  description?: string;
  kind: string;
  variant?: string;
  options?: unknown;

  reportDefinitions: (prefix: string) => { model: Array<Step>; dataset: Array<DatasetDefinition> };
  elementKey: string;
}

interface SourceDefinition {
  name: string;
  definition: { [key: string]: string };
  rows?: RowDefinition;
}

// // // // // // // // // // // // // // // // // // // // // // // // //

interface ChartOptions extends SourceDefinition {
  name: string;
  source: string|SourceDefinition;

  chartType?: string;
  labelColumn: string;
  dataColumns: Array<{ name: string; label?: string }>;

  // things to transform the data
  // @todo provide an array of these so we can control their order and stuff?
  transform?: Partial<StepTransform>;
  group?: Partial<StepGroup>;
}

export class ElementChart implements Element {
  public name = ''
  public description = ''
  public kind = ''
  public options?: Array<ChartOptions>

  constructor (p: ElementChart) {
    Apply(this, p, String, 'name', 'description', 'kind')

    this.kind = 'chart'
    this.options = p.options
  }

  reportDefinitions (prefix: string): { model: Array<Step>; dataset: Array<DatasetDefinition> } {
    const model: Array<Step> = []
    const dataset: Partial<DatasetDefinition> = {}
    const auxMM: Array<{ rootName: string; name: string; model: Array<Step>; dataset: Array<DatasetDefinition> }> = []
    const oo = this.options || []

    // - go over all of the chart definitions and prepare model steps
    for (let i = oo.length - 1; i >= 0; i--) {
      const opt = oo[i]
      const m = this.modelChart(opt, prefix)
      if (m) {
        auxMM.push(m)
      }
    }

    // @todo joins
    const opt = oo[0]
    // the most specific one; so the last one
    const rootDef = auxMM[auxMM.length - 1]
    model.push(...rootDef.model)

    // prepare the dimension
    //
    // @todo paging, sorting, filtering
    dataset.name = prefix + this.elementKey
    dataset.dimension = rootDef.name
    dataset.columns = [{ name: opt.labelColumn }].concat(opt.dataColumns.map(d => ({ ...d })))

    return { model: model, dataset: [dataset as DatasetDefinition] }
  }

  private modelChart (opt: TableOptions, prefix: string): { model: Array<Step>; rootName: string; name: string; dataset: Array<DatasetDefinition> }|undefined {
    const model: Array<Step> = []
    let rootName = ''
    let crtName = ''

    // - things to load
    if ((typeof opt.source) === 'object') {
      const src = opt.source as SourceDefinition
      rootName = opt.name
      crtName = prefix + `[${rootName}]`

      model.push(StepFactory({
        load: {
          name: crtName,
          source: src.name,
          definition: src.definition,
          rows: src.rows,
        },
      }))
    }

    // - additional transformations in desc order
    //   1. transform
    //   2. group
    if (opt.transform) {
      const oldName = crtName
      crtName = `transform(${crtName})`
      model.push(StepFactory({
        transform: {
          name: crtName,
          columns: opt.transform.columns,
          dimension: oldName,
          rows: opt.transform.rows,
        },
      }))
    }

    if (opt.group) {
      const oldName = crtName
      crtName = `group(${crtName})`
      model.push(StepFactory({
        group: {
          name: crtName,
          dimension: oldName,
          columns: opt.group.columns,
          groups: opt.group.groups,
        },
      }))
    }

    return {
      dataset: [],
      model: model,
      name: crtName,
      rootName,
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
  name: string;
  source: string|SourceDefinition;
  columns?: Array<TableColumn>;

  // things to transform the data
  // @todo provide an array of these so we can control their order and stuff?
  transform?: Partial<StepTransform>;
  group?: Partial<StepGroup>;

  // relationships define how the two tables are joined.
  // the original table (local table) defines this.
  relationships?: Array<{ column: string; refTable: string; refColumn: string }>;
}

export class ElementTable implements Element {
  public name = ''
  public description = ''
  public kind = ''
  public variant = ''
  public options?: Array<TableOptions>

  constructor (p: Partial<ElementTable>) {
    Apply(this, p, String, 'name', 'description', 'kind', 'variant')

    this.kind = 'table'
    this.options = p.options
  }

  reportDefinitions (prefix: string): { model: Array<Step>; dataset: Array<DatasetDefinition> } {
    switch (true) {
      case this.variant === '' ||
           this.variant === 'generic' ||
           this.variant === 'stacked':
        return this.definitionsGeneric(prefix)
    }
    throw new Error('unknown table variant ' + this.variant)
  }

  definitionsGeneric (prefix: string): { model: Array<Step>; dataset: Array<DatasetDefinition> } {
    const model: Array<Step> = []
    const dataset: Partial<DatasetDefinition> = {}
    const auxMM: Array<{ rootName: string; name: string; model: Array<Step>; dataset: Array<DatasetDefinition> }> = []
    const oo = this.options || []

    // - go over all of the table definitions and prepare model steps
    for (let i = oo.length - 1; i >= 0; i--) {
      const opt = oo[i]
      auxMM.push(this.modelTable(opt, prefix))
    }

    // - handle table joins
    //
    // Take the first definition as a base.
    // Any table that needs to be included in the output must be referenced
    // by the root table (the first one).
    //
    // @todo nested tables?
    const opt = oo[0]
    // the most specific one; so the last one
    const rootDef = auxMM[auxMM.length - 1]
    model.push(...rootDef.model)

    // prepare the dimension
    //
    // @todo paging, sorting, filtering
    dataset.name = prefix + this.elementKey
    dataset.dimension = rootDef.name
    dataset.columns = [...(oo[0].columns || [])]
    if (opt.relationships) {
      // only prefix columns if we will be joining things
      dataset.columns = dataset.columns.map(({ name, ...rest }) => ({ ...rest, name: `${rootDef.name}.${name}` }))
    }

    for (const rel of opt.relationships || []) {
      // find the related table
      const relDef = auxMM.find(({ rootName }) => rootName === rel.refTable)
      if (!relDef) {
        throw new Error('unable to resolve the referenced table: ' + rel.refTable)
      }

      // add related model steps
      model.push(...relDef.model)

      // - add join definition
      const name = `[${rootDef.name}:${rel.column}]+[${relDef.name}:${rel.refColumn}]`
      model.push(StepFactory({
        join: {
          local: `${rootDef.name}.${rel.column}`,
          foreign: `${relDef.name}.${rel.refColumn}`,
          name,
        },
      }))
      dataset.dimension = name

      // - add the dataset def
      const relOpt = oo.find(({ name }) => name === relDef.rootName)
      dataset.columns.push(...(relOpt?.columns?.map(({ name, ...rest }) => ({ ...rest, name: `${relDef.name}.${name}` })) || []))
    }

    return { model: model, dataset: [dataset as DatasetDefinition] }
  }

  private modelTable (opt: TableOptions, prefix: string): { model: Array<Step>; rootName: string; name: string; dataset: Array<DatasetDefinition> } {
    const model: Array<Step> = []
    let rootName = ''
    let crtName = ''

    // - things to load
    if ((typeof opt.source) === 'object') {
      const src = opt.source as SourceDefinition
      rootName = opt.name
      crtName = prefix + `[${rootName}]`

      model.push(StepFactory({
        load: {
          name: crtName,
          source: src.name,
          definition: src.definition,
          rows: src.rows,
        },
      }))
    }

    // - additional transformations in desc order
    //   1. transform
    //   2. group
    if (opt.transform) {
      const oldName = crtName
      crtName = `transform(${crtName})`
      model.push(StepFactory({
        transform: {
          name: crtName,
          columns: opt.transform.columns,
          dimension: oldName,
          rows: opt.transform.rows,
        },
      }))
    }

    if (opt.group) {
      const oldName = crtName
      crtName = `group(${crtName})`
      model.push(StepFactory({
        group: {
          name: crtName,
          dimension: oldName,
          columns: opt.group.columns,
          groups: opt.group.groups,
        },
      }))
    }

    return {
      dataset: [],
      model: model,
      name: crtName,
      rootName,
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
      case 'table':
        return ElementFactory.MakeTable(e as ElementTable)
      case 'chart':
        return ElementFactory.MakeChart(e as ElementChart)
      default:
        throw new Error('unknown display element: ' + e.kind)
    }
  }

  public static MakeTable (e: ElementTable): ElementTable {
    return new ElementTable(e)
  }

  public static MakeChart (e: ElementChart): ElementChart {
    return new ElementChart(e)
  }
}
