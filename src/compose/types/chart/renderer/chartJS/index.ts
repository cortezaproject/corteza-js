import { BaseChart, PartialChart } from '../base'
import { isRadialChart, makeAlias, makeDataLabel, ChartType } from '../util'
import { makeTipper } from './plugins'

const ChartJS = require('chart.js')

export default class Chart extends BaseChart {
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
    let baseType = ''

    this.config.reports?.forEach((r: any) => {
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

      if (r.metrics.find((m: any) => !isRadialChart(m.type as ChartType))) {
        options.scales.xAxes = r.dimensions.map((d: any) => {
          const ticks = {
            autoSkip: !!d.autoSkip,
          }
          const timeDimensionUnit = (Chart.dimensionFunctions.lookup(d) || {}).time

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

      options.scales.yAxes = r.metrics.map((m: any) => {
        return {
          display: !isRadialChart(m.type as ChartType),
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

      datasets.push(...r.metrics.map(({ field, fill, aggregate, label, type, backgroundColor, fixTooltips, relativeValue, relativePrecision, ...rr }: any) => {
        const alias = makeAlias({ field, aggregate })
        if (baseType === '') {
          baseType = type
        }

        if (typeof backgroundColor === 'string') {
          const c = backgroundColor
          const o = 0.7
          backgroundColor = 'rgba(' + parseInt(c.slice(-6, -4), 16) + ',' + parseInt(c.slice(-4, -2), 16) + ',' + parseInt(c.slice(-2), 16) + ',' + o + ')'
        }

        fill = !!fill
        if (!label) label = field

        const d = {
          yAxisID: `y-axis-metric-${alias}`,
          label,
          lineTension: 0,
          type,
          fill,
          backgroundColor,
          tooltips: {
            enabled: true,
            relativeValue,
            relativePrecision,
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
}
