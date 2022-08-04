import { get } from 'lodash'
const colorschemes = require('chartjs-plugin-colorschemes/src/colorschemes').default

export const getColorschemeColors = (colorscheme?: string): string[] => {
  if (!colorscheme) {
    return []
  }

  return [...get(colorschemes, colorscheme)]
}
