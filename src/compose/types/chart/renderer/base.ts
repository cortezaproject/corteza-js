import {
  CortezaID,
  NoID,
  ISO8601Date,
  Apply,
} from '../../../../cast'
import {
  makeAlias,
  DimensionFunctions,
  isRadialChart,
  makeColorSteps,
  ChartConfig,
  Dimension,
  Metric,
  Report,
  ChartType,
} from './util'
import moment from 'moment'

const defaultBGColor = 'rgba(165, 165, 165, 1)'

export interface PartialChart extends Partial<Omit<BaseChart, 'config'>>{
  config: ChartConfig;
}

interface DimensionFunction {
  text: string;
  value: string;
  convert: (f: string) => string;
  time: boolean | object;
}

const dimensionFunctions: DimensionFunctions<DimensionFunction> = DimensionFunctions.create<DimensionFunction>()
dimensionFunctions.push(...[
  {
    text: 'none',
    value: '(no grouping / buckets)',
    convert: (f: string) => f,
    time: false,
  },

  {
    text: 'date',
    value: 'DATE',
    convert: (f: string) => `DATE(${f})`,
    time: { unit: 'day', minUnit: 'day', round: true },
  },

  {
    text: 'week',
    value: 'WEEK',
    convert: (f: string) => `DATE(${f})`,
    time: { unit: 'week', minUnit: 'week', round: true, isoWeekday: true },
  },

  {
    text: 'month',
    value: 'MONTH',
    convert: (f: string) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'month', minUnit: 'month', round: true },
  },

  {
    text: 'quarter', // fetch monthly aggregation but tell renderer to group by quarter
    value: 'QUARTER',
    convert: (f: string) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'quarter', minUnit: 'quarter', round: true },
  },

  {
    text: 'year',
    value: 'YEAR',
    convert: (f: string) => `DATE_FORMAT(${f}, '%Y-01-01')`,
    time: { unit: 'year', minUnit: 'year', round: true },
  },
])

export class BaseChart {
  public chartID = NoID
  public namespaceID = NoID
  public name = ''
  public handle = ''

  public createdAt?: Date = undefined
  public updatedAt?: Date = undefined
  public deletedAt?: Date = undefined

  public canUpdateChart = false
  public canDeleteChart = false
  public canGrant = false

  public config: ChartConfig = {}

  constructor (c?: PartialChart) {
    this.apply(c)
  }

  apply (c?: PartialChart) {
    if (!c) {
      return
    }

    Apply(this, c, CortezaID, 'chartID', 'namespaceID')
    Apply(this, c, String, 'name', 'handle')

    Apply(this, c, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, c, Boolean, 'canUpdateChart', 'canDeleteChart', 'canGrant')

    Apply(this, c, Object, 'config')
  }

  isValid (): boolean {
    const dimCheck = ({ field, modifier }: Dimension) => {
      if (!field) {
        throw new Error('notification.chart.invalidConfig.missingDimensionsField')
      }
      if (!modifier) {
        throw new Error('notification.chart.invalidConfig.missingDimensionsModifier')
      }
    }

    const mtrCheck = ({ field, aggregate, type }: Metric) => {
      if (!field) {
        throw new Error('notification.chart.invalidConfig.missingMetricsField')
      }
      if (field !== 'count' && !aggregate) {
        throw new Error('notification.chart.invalidConfig.missingMetricsAggregate')
      }
      if (!type) {
        throw new Error('notification.chart.invalidConfig.missingMetricsType')
      }
    }

    if (!this.config.reports || !this.config.reports.length) {
      throw new Error('notification.chart.invalidConfig.missingReports')
    }

    this.config.reports.map(({ moduleID, dimensions, metrics }) => {
      if (!moduleID) {
        throw new Error('notification.chart.invalidConfig.missingModuleID')
      }

      // Expecting all dimensions to have defined fields
      dimensions.forEach(dimCheck)

      // Expecting all metrics to have defined fields
      metrics.forEach(mtrCheck)
    })

    return true
  }

  // prepares data for the reporter function
  formatReporterParams ({ moduleID, metrics, dimensions, filter }: Report) {
    return {
      moduleID,
      filter,

      // Remove count (we'll get it anyway) and construct FUNC(ARG) params
      metrics: metrics?.filter((m: Metric) => m.field !== 'count').map((m: Metric) => `${m.aggregate}(${m.field}) AS ${makeAlias(m)}`).join(','),

      // Construct dimensions \w modifiers...
      dimensions: dimensions?.map((d: Dimension) => dimensionFunctions.convert(d))[0],
    }
  }

  private processReporterResults (results: Array<object>, report: Report) {
    const dLabel = 'dimension_0'
    const { dimensions: [dimension] = [] } = report
    const isTimeDimension = !!(dimensionFunctions.lookup(dimension) || {}).time
    const getLabel = (rLabel: string | undefined, { default: dDft }: Dimension): string => {
      if (rLabel) return rLabel
      if (dDft) return dDft
      return 'undefined'
    }

    let labels: Array<string> = []

    // Skip missing values; if so requested
    if (dimension.skipMissing) {
      results = results.filter((r: any) => r[dLabel] !== null)
    }

    if (!isTimeDimension) {
      // Not a time dimensions, build set of labels
      labels = results.map((r: any) => getLabel(r[dLabel], dimension))
    }

    const metrics = report.metrics?.map(({ field, aggregate }) => {
      const alias = makeAlias({ field, aggregate })

      return results.map((r: any) => {
        const y: any = r[field === 'count' ? field : alias]
        if (!isTimeDimension) {
          // Return a set of integers
          return getLabel(y, dimension)
        }

        // Return objects {y,t}
        return { y, t: moment(getLabel(r[dLabel], dimension)).toDate() }
      })
    }) || []

    return { labels, metrics }
  }

  async fetchReports ({ reporter }: { reporter(p: any): Promise<any> }) {
    const out: Array<any> = []

    // Prepare params & filter out invalid combos (formatReporterParams will return null on invalid params)
    const reports: any = this.config.reports?.map(this.formatReporterParams)
      // Send requests to reporter (API caller)
      .map(params => reporter(params))
      // Process each result
      .map((p: any, index: number) => p.then((results: any) => { out[index] = this.processReporterResults(results, (this.config.reports || [])[index]) }))

    // Wait for all requests to finish and return new promise, with results
    return Promise.all(reports).then(() => new Promise(resolve => {
      // @todo this does not really support multiple reports per chart (hence the out[0]
      //       if we want to support that, label & data sync across all reports needs to be
      resolve(out[0])
    }))
  }

  prepData ({ labels, metrics }: { labels?: Array<string>; metrics?: Array<number> } = {}, base: any = {}) {
    if (labels) {
      base.labels = labels
    }

    metrics?.forEach((metric: number, index: number) => {
      const ds = base.datasets[index]
      ds.data = metric
      if (isRadialChart(ds.type as ChartType)) {
        ds.backgroundColor = makeColorSteps(ds.backgroundColor || defaultBGColor, ds.data.length)
        ds.hoverBackgroundColor = ds.backgroundColor
      }
    })
  }

  buildOptions () {
    throw new Error('method.notImplemented')
  }

  public static dimensionFunctions = dimensionFunctions
}
