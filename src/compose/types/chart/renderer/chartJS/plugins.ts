import { makeDataLabel } from '../util'
interface PluginOptions {
  [_: string]: any;
}

export function makeTipper (Tooltip: any, options: PluginOptions = {}) {
  return {
    id: 'tipper',

    beforeRender: (chart: any) => {
      chart.options.tooltips.enabled = true
      // build a tooltip for each data set data node
      const tipperTips = chart.config.data.datasets.map((_: any, i: number) => {
        // getDatasetMeta provides element selector; dataset does not
        return chart.getDatasetMeta(i).data.map((sc: any) => {
          const opts: PluginOptions = {
            ...chart.options.tooltips,
            // force these values
            displayColors: false,
            caretPadding: 10,
            caretSize: 0,
            xPadding: 2,
            yPadding: 2,
            cornerRadius: 2,
            ...options,
          }

          opts.callbacks.label = ({ datasetIndex, index }: any, { datasets }: any) => {
            const dataset = datasets[datasetIndex]
            return makeDataLabel({
              value: dataset.data[index],
              dataset,
              relativeValue: dataset.tooltips.relativeValue,
              relativePrecision: dataset.tooltips.relativePrecision,
            })
          }

          return new Tooltip({
            _chart: chart.chart,
            _chartInstance: chart,
            _data: chart.data,
            _options: opts,
            _active: [sc],
          }, chart)
        })
      })

      chart.config.tipperTips = tipperTips
      chart.options.tooltips.enabled = false
    },

    afterDraw: (chart: any, easing: any) => {
      // enable for drawing window
      chart.options.tooltips.enabled = true
      chart.config.tipperTips.forEach((ds: Array<any>) => {
        ds.forEach(tt => {
          tt.initialize()
          tt.update()
          tt.transition(easing).draw()
        })
      })
      chart.options.tooltips.enabled = false
    },
  }
}
