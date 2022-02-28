import { BaseChart, PartialChart } from './base'
import {
  Dimension,
  Metric,
  Report,
  ChartType,
  makeDataLabel,
  calculatePercentages,
} from './util'

import { defaultBGColor } from './common'
import { makeTipper } from './chartjs/plugins'
const ChartJS = require('chart.js')

/**
 * Funnel chart provides the definitions for the chartjs-plugin-funnel plugin.
 */
export default class FunnelChart extends BaseChart {
  constructor (def: PartialChart = {}) {
    super(def)

    // Assure required fields; this helps with backwards compatibility
    for (const v of (this.config.reports || []) as Array<Report>) {
      for (const d of (v.dimensions || []) as Array<Dimension>) {
        if (!d.meta) {
          d.meta = {}
        }

        if (!d.meta.fields) {
          d.meta.fields = []
        }
      }
    }
  }

  /**
   * Since funnel charts always define one type, this check can be simplified
   */
  mtrCheck ({ field, aggregate }: Metric) {
    if (!field) {
      throw new Error('notification.chart.invalidConfig.missingMetricsField')
    }
    if (field !== 'count' && !aggregate) {
      throw new Error('notification.chart.invalidConfig.missingMetricsAggregate')
    }
  }

  /**
   * Extend this method to include filtering for just specific values.
   * For example:
   * We wish to show only new and converted leads.
   */
  formatReporterParams (r: Report) {
    const base = super.formatReporterParams(r)
    const ff = base.filter

    let df = ''
    if (r.dimensions && r.dimensions[0]) {
      const rd = r.dimensions[0]
      if (r.dimensions[0].meta) {
        const fields = r.dimensions[0].meta.fields || []
        df = fields.map(({ value }: any) => `${rd.field || ''}='${value}'`)
          .join(' OR ')
      }
    }

    if (ff && df) {
      base.filter = `(${base.filter}) AND (${df})`
    } else if (!ff && df) {
      base.filter = df
    }

    return base
  }

  // Funnel chart creates a metric including all reports, so this step is deferred to there
  makeDataset (m: Metric, d: Dimension, data: Array<number|any>, alias: string) {
    const ds: any = { data }
    return ds
  }

  // No much configurations available for funnel charts
  makeOptions (data: any) {
    const options: any = {
      sort: 'desc',
      maintainAspectRatio: false
    }

    if (this.config.colorScheme) {
      options.plugins = {
        colorschemes: {
          scheme: this.config.colorScheme,
          // this is a bit of a hack to make the plugin work on each dataset value
          // we should improve this at a later point in time, but is ok for now.
          custom: (e: Array<string>) => {
            const cls = [...e]
            while (cls.length < data.datasets[0].data.length) {
              cls.push(...e)
            }
            data.datasets[0].backgroundColor = cls.slice(0, data.datasets[0].data.length)
            return e
          },
        },
      }
    }

    options.tooltips = {
      enabled: true,
      displayColors: false,
      callbacks: {
        label: this.makeLabel,
      },
    }
    return options
  }

  private makeLabel ({ datasetIndex, index }: any, { datasets, labels }: any): any {
    const dataset = datasets[datasetIndex]

    const percentages = calculatePercentages(
      [...dataset.data],
      2,
      true,
    )

    return makeDataLabel({
      prefix: labels[index],
      value: dataset.data[index],
      relativeValue: percentages[index],
    })
  }

  /**
   * @note Funel chart requires the use of chartjs-plugin-funnel.
   * I was unable to make this work if the plugin was provided from this object,
   * so the plugin is registered on the webapp.
   * We should fix this at a later point in time...
   */
  plugins (mm: Array<Metric>) {
    return [makeTipper(ChartJS.Tooltip, {})]
  }

  baseChartType (datasets: Array<any>) {
    return 'funnel'
  }

  /**
   * Includes a few additional post processing steps:
   * * generate a set of labels based on all reports, all data sets,
   * * generates a set of data based on all reports, all data sets,
   * * creates a sort of a commutative chart
   * ** if a record is in the second stage, it's safe to assume that it has
   *    already passed the first stage.
   */
  async fetchReports (a: any) {
    let labels = []
    let data: any = []
    const rr = await super.fetchReports(a) as any

    // Above provided data sets might not have their labels/values ordered
    // correctly
    const valMap: any = {}
    // Map values to their labels
    for (let ri = 0; ri < rr.length; ri++) {
      const r = rr[ri]
      r.labels.forEach((l: string, i: number) => {
        valMap[l] = r.datasets[0].data[i]
      })

      // Construct labels & data based on provided reports
      const report = this.config.reports?.[ri]
      const d = report?.dimensions?.[0] as Dimension
      for (const { value } of d.meta?.fields || []) {
        labels.push(value)
        data.push(valMap[value] || 0)
      }
    }

    // We are rendering the chart upside down
    // (by default it renders in ASC, but we want DESC)
    labels = labels.reverse()
    data = data.reverse()

    // Determine color to render for specific value
    const colorMap: { [_: string]: string } = {}
    this.config.reports?.forEach(r => {
      for (const { value, color } of r.dimensions?.[0].meta?.fields) {
        colorMap[value] = color
      }
    })

    // Create a commutative (see method comment)
    for (let i = 1; i < data.length; i++) {
      data[i] += data[i - 1]
    }

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map(l => colorMap[l] || defaultBGColor),
      }],
    }
  }

  defMetrics (): Metric {
    return Object.assign({}, { type: ChartType.funnel })
  }

  defDimension (): Dimension {
    return Object.assign({}, { conditions: {}, meta: { fields: [] } })
  }
}
