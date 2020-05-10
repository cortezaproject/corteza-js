import { BaseChart, PartialChart } from './base'
import {
  Metric,
  Report,
  Dimension,
  ChartType,
} from './util'
import { makeTipper } from './chartjs/plugins'
import { defaultBGColor } from './common'

const ChartJS = require('chart.js')

/**
 * Gauge chart provides the definitions for the chartjs-plugin-funnel plugin.
 */
export default class GaugeChart extends BaseChart {
  constructor (def: PartialChart = {}) {
    super(def)

    // Assure required fields
    for (const v of (this.config.reports || []) as Array<Report>) {
      for (const d of (v.dimensions || []) as Array<Dimension>) {
        if (!d.meta) {
          d.meta = {}
        }

        if (!d.meta.steps) {
          d.meta.steps = []
        }
      }
    }
  }

  /**
   * Since gauge charts always define one type, this check can be simplified
   */
  mtrCheck ({ field, aggregate }: Metric) {
    if (!field) {
      throw new Error('notification.chart.invalidConfig.missingMetricsField')
    }
    if (field !== 'count' && !aggregate) {
      throw new Error('notification.chart.invalidConfig.missingMetricsAggregate')
    }
  }

  // Gauge charts (at the moment) support only 1 report per chart
  async fetchReports (a: any) {
    return super.fetchReports(a).then((rr: any) => {
      return rr[0]
    })
  }

  processLabels (ll: Array<string>, d: Dimension) {
    return (d.meta?.steps || []).map(({ label }: any) => label)
  }

  makeDataset (m: Metric, d: Dimension, data: Array<number|any>, alias: string) {
    const steps = (d.meta?.steps || [])

    return {
      value: data.reduce((acc, cur) => acc + cur, 0),
      data: steps.map(({ value }: any) => parseFloat(value)),
      backgroundColor: steps.map(({ color }: any) => color),
    }
  }

  makeOptions () {
    const rep = this.config.reports?.[0]
    const { metrics: [metric] = [] } = rep || {}

    return {
      needle: {
        radiusPercentage: 2,
        widthPercentage: 3.5,
        lengthPercentage: 70,
        color: metric.backgroundColor || defaultBGColor,
      },
      tooltips: {
        enabled: true,
      },
      valueLabel: {
        display: true,
        color: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5,
        padding: {
          top: 10,
          bottom: 10
        }
      }
    }
  }

  /**
   * @note Gauge chart requires the use of chartjs-gauge.
   * I was unable to make this work if the plugin was provided from this object,
   * so the plugin is registered on the webapp.
   * We should fix this at a later point in time...
   */
  plugins () {
    const mm: Array<Metric> = []

    for (const r of (this.config.reports || []) as Array<Report>) {
        mm.push(...(r.metrics || []) as Array<Metric>)
    }

    const rr: Array<any> = []
    if (mm.find(({ fixTooltips }) => fixTooltips)) {
      rr.push(makeTipper(ChartJS.Tooltip, {}))
    }
    return rr
  }

  baseChartType (datasets: Array<any>) {
    return 'gauge'
  }

  defMetrics (): Metric {
    return Object.assign({}, { type: ChartType.gauge })
  }
}
