export const rgbaRegex = /^rgba\((\d+),.*?(\d+),.*?(\d+),.*?(\d*\.?\d*)\)$/

function ln (n: number): number {
  return Math.round(n < 0 ? 255 + n : (n > 255) ? n - 255 : n)
}

export enum ChartType {
  pie = 'pie',
  bar = 'bar',
  line = 'line',
  doughnut='doughnut',
}

export enum ChartRenderer {
  chartJS = 'chart.js'
}

export interface Dimension {
  conditions: object;
  field?: string;
  modifier?: string;
  default?: string;
  skipMissing?: boolean;
  autoSkip?: boolean;
}

export interface Metric {
  axisType?: string;
  field?: string;
  fixTooltips?: boolean;
  relativeValue?: boolean;
  type?: ChartType;
  alias?: string;
  aggregate?: string;
  modifier?: string;
}

export interface Report {
  moduleID?: string;
  filter?: string;
  dimensions?: Array<Dimension>;
  metrics?: Array<Metric>;
}

export interface ChartConfig {
  renderer?: {
    version?: ChartRenderer;
  };

  reports?: Array<any>;
}

export function toRGBA ([r, g, b, a]: number[]): string {
  return `rgba(${ln(r)}, ${ln(g)}, ${ln(b)}, ${a})`
}

export function defDimension (): Dimension {
  return { conditions: {} }
}

export function defMetrics (): Metric {
  return {}
}

export function defReport (): Report {
  return {
    dimensions: [defDimension()],
    metrics: [defMetrics()],
  }
}

export function defConfig (): ChartConfig {
  return Object.assign({}, {
    reports: [defReport()],
    renderer: {
      version: ChartRenderer.chartJS,
    },
  })
}

export const makeAlias = ({ alias, aggregate, modifier, field }: Metric) => alias || `${aggregate || modifier || 'none'}_${field}`

export class DimensionFunctions<T> extends Array<T> {
  private constructor (items?: Array<T>) {
    super(...(items || []))
  }

  static create<T> (): DimensionFunctions<T> {
    return Object.create(DimensionFunctions.prototype)
  }

  public lookup (d: any): any {
    return this.find((f: any) => d.modifier === f.value)
  }

  public convert (d: any): any {
    return (this.lookup(d) || {}).convert(d.field)
  }
}

export const isRadialChart = (type: ChartType) => {
  const rr = type === ChartType.doughnut || type === ChartType.pie
  return rr
}

export const hasRelativeDisplay = (type: ChartType) => isRadialChart(type)
export function makeColorSteps (base: string, steps: number): Array<string> {
  if (!steps) {
    return [base]
  }

  const pts = rgbaRegex.exec(base)
  if (!pts || pts.length < 4) {
    throw new Error('notification.color.RGBA.invalid')
  }

  // get color in
  const cc = pts.slice(1).map(parseFloat)
  // already validated above
  const a: number = cc.pop() as number

  const rtr: Array<string> = []
  for (let i = 0; i < steps; i++) {
    const adj = cc.map(c => (c - i * (c / steps))).concat([a])
    rtr.push(toRGBA(adj))
  }

  return rtr
}

export const makeDataLabel = ({
  prefix = '',
  value = 0,
  dataset = {},
  relativeValue = false,
  relativePrecision = 2,
  suffix = '',
}: any) => {
  let newValue = ''

  console.log({
    prefix,
    value,
    dataset,
    relativeValue,
    relativePrecision,
    suffix,
  })

  // If time dimension is provided, value is represented with a { y, t } object
  if (typeof value === 'object') {
    newValue = value.y || 0
  } else {
    newValue = `${value}`
  }

  if (relativeValue && hasRelativeDisplay(dataset.type as ChartType)) {
    // get relative value
    const total = dataset.data.reduce((acc: number, cur: number) => acc + cur, 0)
    newValue = (value / total * 100).toFixed(parseInt(relativePrecision || 2))
    suffix = suffix || '%'
  }

  return `${prefix ? prefix + ': ' : ''}${(newValue)}${suffix}`
}
