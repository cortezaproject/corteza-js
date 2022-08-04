import { BaseChart, PartialChart } from './base'
import {
  Metric,
  Report,
  Dimension,
  ChartType,
} from './util'
import { getColorschemeColors } from '../../../shared'

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

    const value = data.reduce((acc, cur) => {
      return !isNaN(cur) ? acc + parseFloat(cur) : acc
    }, 0)

    const max = Math.max(...steps.map(({ value }: any) => parseFloat(value)))

    const { label: name } = [...steps].sort((a: any, b: any) => {
      return parseFloat(b.value) - parseFloat(a.value)
    }).reduce((acc: any, cur: any) => {
      const curValue = parseFloat(cur.value)
      return value < curValue ? cur : acc
    }, {})

    return {
      steps,
      name,
      max,
      value,
    }
  }

  makeOptions (data: any) {
    const { colorScheme } = this.config
    const { datasets = [] } = data
    const { steps, name, value, max } = datasets.find(({ value }: any) => value)
    const colors = getColorschemeColors(colorScheme)

    const color = steps.map((s: any, i: number) => {
      debugger
      return [s.value / max, colors[i]]
    })

    return {
      textStyle: {
        fontFamily: 'Poppins-Regular',
      },
      grid: {
        left: '10%',
      },
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max,
          splitNumber: 5,
          radius: '120%',
          center: ['50%', '65%'],
          pointer: {
            length: '50%',
            itemStyle: {
              color: '#464646',
            },
          },
          splitLine: {
            distance: 0,
            length: 0,
            lineStyle: {
              color: '#fff',
            },
          },
          axisLine: {
            lineStyle: {
              width: 50,
              color: steps.map((s: any, i: number) => {
                return [s.value / max, colors[i]]
              }),
            },
          },
          axisTick: {
            show: false,
            distance: -30,
          },
          axisLabel: {
            distance: 60,
          },
          title: {
            offsetCenter: [0, '35%'],
          },
          detail: {
            fontSize: 16,
            offsetCenter: [0, '20%'],
            valueAnimation: true,
            color: 'inherit',
          },
          data: [
            {
              name,
              value,
            },
          ],
        },
      ],
    }
  }

  baseChartType (): string {
    return 'gauge'
  }

  defMetrics (): Metric {
    return Object.assign({}, { type: ChartType.gauge })
  }
}
