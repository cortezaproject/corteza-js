import { PageBlock, PageBlockInput, Registry } from './base'
import { dimensionFunctions } from '../chart/util'
import { CortezaID } from '../../../cast'

const kind = 'Metric'

enum Operation {
  COUNT = 'countd',
}

type Reporter = (p: ReporterParams) => Promise<any>

interface ReporterParams {
  moduleID: string;
  filter?: string;
  metrics?: Array<string>;
  dimensions: string;
}

interface Style {
  color: string;
  backgroundColor: string;
  fontSize: string;
}

interface Metric {
  moduleID: string;
  operation: Operation;
  filter?: string;
  bucketSize?: string;
  label: string;
  numberFormat?: string;
  dateFormat?: string;
  // @todo allow conditional styles; eg. if value is < 10 render with bold red text
  labelStyle?: Style;
  valueStyle?: Style;
}

interface Options {
  metrics: Array<Metric>;
}

const defaults: Readonly<Options> = Object.freeze({
  metrics: [],
})

export class PageBlockMetric extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    if (o.metrics) {
      this.options.metrics = o.metrics
    }
  }

  /**
   * Helper function to fetch and parse reporter's reports.
   */
  async fetch ({ m }: { m: Metric }, reporter: Reporter): Promise<object> {
    const w = await reporter(this.formatParams(m))
    const dLabel = 'dimension_0'
    let rtr = w.map((r: any) => {
      const label = r[dLabel]
      const value = r.count
      return { label, value }
    })

    return rtr
  }

  /**
   * Helper to construct reporter's params
   */
  private formatParams ({ moduleID, filter, bucketSize }: Metric): ReporterParams {
    const field = 'created_at'

    return {
      moduleID,
      filter,
      metrics: [],
      dimensions: dimensionFunctions.convert({ modifier: bucketSize, field })
    }
  }
}

Registry.set(kind, PageBlockMetric)
