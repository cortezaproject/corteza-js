import _ from 'lodash'
import moment from 'moment'
import {
  makeDataLabel,
  ChartConfig,
  ChartRenderer,
  ChartType,
  Dimension,
  Metric,
  Report,
  isRadialChart,
  makeColorSteps,
  dimensionFunctions,
  KV,
} from './util'

import {
  CortezaID,
  NoID,
  ISO8601Date,
  Apply,
} from '../../../cast'

import { makeTipper } from './plugins'
const ChartJS = require('chart.js')

const defDimension = () => Object.assign({}, { conditions: {} })
const defMetrics = () => Object.assign({}, {})

const defReport = () => Object.assign({}, {
  moduleID: null,
  filter: null,
  dimensions: [defDimension()],
  metrics: [defMetrics()],
})

const defConfig = () => Object.assign({}, {
  reports: [defReport()],
  renderer: {
    version: 'chart.js',
  },
})

const defaultFx = 'n'

interface PartialChart extends Partial<Chart>{}
const defaultBGColor = 'rgba(165, 165, 165, 1)'
// Makes a standarised alias from modifier or dimension report option
const makeAlias = ({ alias, aggregate, modifier, field }: Metric) => alias || `${aggregate || modifier || 'none'}_${field}`

export class Chart {
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

  constructor (def: PartialChart = {}) {
    this.merge(def)
  }

  merge (c: PartialChart) {
    let conf = { ...(c.config || {}) }
    Apply(this, c, CortezaID, 'chartID', 'namespaceID')
    Apply(this, c, String, 'name', 'handle')
    Apply(this, c, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, c, Boolean, 'canUpdateChart', 'canDeleteChart', 'canGrant')
    Apply(this, c, Object, 'config')

    if (typeof c.config === 'object') {
      // Verify & normalize
      let { renderer, reports } = c.config

      if (renderer) {
        const { version } = renderer || {}

        if (version !== 'chart.js') {
          throw Error('notification.chart.unsupportedRenderer')
        }
      } else {
        renderer = { version: ChartRenderer.chartJS }
      }

      conf = { renderer, reports: reports || [] }
    }

    this.config = (conf ? _.merge(defConfig(), conf) : false) || this.config || defConfig()
  }

  // Static validation of reports (metrics, dimensions, fields set)
  isValid () {
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

  prepData ({ labels, metrics }: { labels?: Array<string>; metrics?: Array<Array<number>> } = {}, base: any = {}, postProcFx: (n: number, m: undefined|number, ds: any) => number) {
    if (labels) {
      base.labels = labels
    }

    metrics?.forEach((metric, index) => {
      const ds = base.datasets[index]

      // Dataset post process function
      for (let i = 0; i < metric.length; i++) {
        const n = metric[i]
        let m
        if (i > 0) {
          m = metric[i - 1]
        }
        metric[i] = postProcFx(n, m, ds)
      }

      ds.data = metric
      if (isRadialChart(ds)) {
        ds.backgroundColor = makeColorSteps(ds.backgroundColor || defaultBGColor, ds.data.length)
        ds.hoverBackgroundColor = ds.backgroundColor
      }
    })
  }

  // Builds renderer (only ChartJS supported) options
  buildOptions () {
    const plugins = new Set()
    const options: any = {
      // Allow chart to consume entire container
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
      },
    }

    const datasets: Array<any> = []
    let baseType: ChartType|undefined

    this.config.reports?.forEach(r => {
      if (!options.scales) options.scales = { xAxes: [], yAxes: [] }

      // can't disable tooltips on dataset level, so this is required
      options.tooltips = {
        filter: ({ datasetIndex }: any, { datasets }: any) => {
          // enabled can be undefined, so it must be checked against false
          return ((datasets[datasetIndex] || {}).tooltips || {}).enabled !== false
        },

        callbacks: {
          label: ({ datasetIndex, index }: any, { datasets, labels }: any) => {
            // get the concerned dataset
            const dataset = datasets[datasetIndex]

            return makeDataLabel({
              prefix: labels[index],
              value: dataset.data[index],
              dataset,
              relativeValue: dataset.tooltips.relativeValue,
              relativePrecision: dataset.tooltips.relativePrecision,
            })
          },
        },
      }

      if (r.metrics.find((m: Metric) => !isRadialChart(m as KV))) {
        options.scales.xAxes = r.dimensions.map((d: Dimension, i: number) => {
          const ticks = {
            autoSkip: !!d.autoSkip,
          }
          const timeDimensionUnit = (dimensionFunctions.lookup(d) || {}).time

          if (timeDimensionUnit) {
            return {
              type: 'time',
              time: timeDimensionUnit,
              ticks,
            }
          } else {
            return {
              ticks,
            }
          }
        })
      }

      options.scales.yAxes = r.metrics.map((m: Metric, i: number) => {
        return {
          display: !isRadialChart(m as KV),
          id: `y-axis-metric-${makeAlias(m)}`,
          type: m.axisType || 'linear',
          position: m.axisPosition || 'left',
          scaleLabel: {
            display: true,
            labelString: m.label || m.field,
          },
          ticks: {
            beginAtZero: !!m.beginAtZero,
          },
        }
      })

      datasets.push(...r.metrics.map(({ field, fill, aggregate, label, type, backgroundColor, fixTooltips, relativeValue, relativePrecision, fx, ...rr }: Metric) => {
        const alias = makeAlias({ field, aggregate })
        if (baseType === undefined) {
          baseType = type
        }

        if (typeof backgroundColor === 'string') {
          const c = backgroundColor
          const o = 0.7
          backgroundColor = 'rgba(' + parseInt(c.slice(-6, -4), 16) + ',' + parseInt(c.slice(-4, -2), 16) + ',' + parseInt(c.slice(-2), 16) + ',' + o + ')'
        }

        fill = !!fill
        if (!label) label = field

        let d = {
          yAxisID: `y-axis-metric-${alias}`,
          label,
          lineTension: 0,
          type,
          fill,
          backgroundColor,
          datalabels: {
            // disables fixed tooltips
            display: false,
          },
          tooltips: {
            enabled: true,
            relativeValue,
            relativePrecision,
          },
          modifiers: {
            fx: fx || defaultFx,
          },
        }

        if (fixTooltips) {
          plugins.add(makeTipper(ChartJS.Tooltip, {}))
        }

        return d
      }))
    })

    return {
      type: baseType,
      options,
      plugins: Array.from(plugins),
      data: { datasets },
    }
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

    const metrics = report.metrics?.map(({ field, fill, aggregate, label, type, backgroundColor }) => {
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

  async export (findModuleByID: ({ namespaceID, moduleID }: { namespaceID: string, moduleID: string }) => Promise<any>) {
    const { namespaceID } = this
    const copy = new Chart(this)
    if (copy.config?.reports) {
      await Promise.all(copy.config.reports.map(async (r: any) => {
        const { moduleID } = r
        if (moduleID) {
          const module = await findModuleByID({ namespaceID, moduleID })
          r.moduleID = module.name
          return r
        } else {
          return null
        }
      })).then((a: any) => {
        return a
      })
    }
    return copy
  }

  import (getModuleID: ( moduleID: string ) => string) {
    const copy = new Chart(this)
    copy.config?.reports?.map(r => {
      const { moduleID } = r
      if (moduleID) {
        r.moduleID = getModuleID(moduleID)
      }
      return r
    })
    return copy
  }
}

export { chartUtil } from './util'
