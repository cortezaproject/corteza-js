import { BaseChart } from './base'
import {
  Dimension,
  Metric,
  dimensionFunctions,
  makeAlias,
  isRadialChart,
  makeColorSteps,
  makeDataLabel,
  KV,
  Report,
} from './util'

import { defaultBGColor } from './common'

import { makeTipper } from './chartjs/plugins'
const ChartJS = require('chart.js')

// The default dataset post processing function to use.
// This one simply returns the current value.
const defaultFx = 'n'

/**
 * Chart represents a generic chart, such as a bar chart, line chart, ...
 */
export default class Chart extends BaseChart {
  // Generic charts (at the moment) support only 1 report per chart
  async fetchReports (a: any) {
    return super.fetchReports(a).then((rr: any) => {
      return rr[0]
    })
  }

  /**
   * The method performs post processing for each value in the given dataset.
   * It works with a simple equation written in javascript (example: n + m).
   * Available variables to use:
   * * n - current value
   * * m - previous value (undefined in case of the first element)
   * * r - entire data array.
   *
   * @param data Array of values in the given data set
   * @param m Metric for the given dataset
   */
  private datasetPostProc (data: Array<number>, m: Metric): Array<number> {
    // Define a valid function to evaluate
    let fxRaw = (m.fx || defaultFx).trim()
    if (!fxRaw.startsWith('return')) {
      fxRaw = 'return ' + fxRaw
    }
    const fx = new Function('n', 'm', 'r', fxRaw)

    // Define a new array, so we don't alter the original one.
    const r = [...data]

    // Run postprocessing for all data in the given data set
    for (let i = 0; i < data.length; i++) {
      const n = data[i]
      let m: number|undefined = undefined
      if (i > 0) {
        m = data[i - 1]
      }
      data[i] = fx(n, m, r)
    }

    return data
  }

  makeDataset (m: Metric, d: Dimension, data: Array<number|any>, alias: string) {
    data = this.datasetPostProc(data, m)
    const ds: any = { data }

    // colors
    if (typeof m.backgroundColor === 'string') {
      if (isRadialChart(m)) {
        ds.backgroundColor = makeColorSteps(m.backgroundColor || defaultBGColor, data.length)
        ds.hoverBackgroundColor = m.backgroundColor
      } else {
        ds.backgroundColor = 'rgba(' + parseInt(m.backgroundColor.slice(-6, -4), 16) + ',' + parseInt(m.backgroundColor.slice(-4, -2), 16) + ',' + parseInt(m.backgroundColor.slice(-2), 16) + ',0.7)'
        ds.hoverBackgroundColor = m.backgroundColor
      }
    }

    return Object.assign(ds, {
      yAxisID: `y-axis-metric-${alias}`,
      label: m.label || m.field,
      lineTension: 0,
      type: m.type,
      fill: !!m.fill,
      tooltips: {
        enabled: true,
        relativeValue: !!m.relativeValue,
        relativePrecision: m.relativePrecision,
      },
    })
  }

  makeOptions () {
    const options: any = {
      // Allow chart to consume entire container
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
      },
    }

    this.config.reports?.forEach(r => {
      if (!options.scales) {
        options.scales = { xAxes: [], yAxes: [] }
      }

      // can't disable tooltips on dataset level, so this is required
      options.tooltips = {
        filter: ({ datasetIndex }: any, { datasets }: any) => {
          // enabled can be undefined, so it must be checked against false
          return ((datasets[datasetIndex] || {}).tooltips || {}).enabled !== false
        },

        callbacks: {
          label: ({ datasetIndex, index }: any, { datasets, labels }: any) => {
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

      if (r.metrics?.find((m: Metric) => !isRadialChart(m as KV))) {
        options.scales.xAxes = r.dimensions?.map((d: Dimension, i: number) => {
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

      options.scales.yAxes = r.metrics?.map((m: Metric, i: number) => {
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
    })
    return options
  }

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
    return datasets[0].type
  }
}
