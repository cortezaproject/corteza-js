import { PartialChart } from './renderer/base'
import _ from 'lodash'
import renderers from './renderer'
import { defConfig, ChartRenderer } from './renderer/util'

/**
 * Chart class serves as an object factory for creating different chart sub versions
 * based on the requested renderer, such as chart.js.
 */
export class Chart {
  constructor (i: PartialChart) {
    if (i.config.renderer) {
      if (i.config.renderer.version !== ChartRenderer.chartJS) {
        throw new Error('notification.chart.unsupportedRenderer')
      }
    } else {
      i.config.renderer = {
        version: ChartRenderer.chartJS,
      }
    }

    // init configuration
    i.config = (i.config ? _.merge(defConfig(), i.config) : false) || i.config || defConfig()

    // init renderer
    switch (i.config?.renderer?.version) {
      case ChartRenderer.chartJS:
        return new renderers.ChartJS(i)

      default:
        throw new Error('chart.config.renderer.invalid')
    }
  }
}
