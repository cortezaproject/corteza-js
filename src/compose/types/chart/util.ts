export const rgbaRegex = /^rgba\((\d+),.*?(\d+),.*?(\d+),.*?(\d*\.?\d*)\)$/

const ln = (n: number) => Math.round(n < 0 ? 255 + n : (n > 255) ? n - 255 : n)
export const toRGBA = ([r, g, b, a]: Array<number>) =>
  `rgba(${ln(r)}, ${ln(g)}, ${ln(b)}, ${a})`

export enum ChartType {
  pie = 'pie',
  bar = 'bar',
  line = 'line',
  doughnut='doughnut',
  funnel = 'funnel',
  gauge = 'gauge',
}

export enum ChartRenderer {
  chartJS = 'chart.js'
}

export interface KV {
  [_: string]: any
}

export interface Dimension {
  meta?: KV;
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
  fx?: string;
  backgroundColor?: string;
  [_: string]: any;
}

export interface Report {
  moduleID?: string|null;
  filter?: string|null;
  dimensions?: Array<Dimension>;
  metrics?: Array<Metric>;
}

export interface ChartConfig {
  renderer?: {
    version?: ChartRenderer;
  };

  reports?: Array<Report>;
  colorScheme?: string;
}

export const aggregateFunctions = [
  {
    value: 'COUNTD',
    text: 'countd',
  },
  {
    value: 'SUM',
    text: 'sum',
  },
  {
    value: 'MAX',
    text: 'max',
  },
  {
    value: 'MIN',
    text: 'min',
  },
  {
    value: 'AVG',
    text: 'avg',
  },
  {
    value: 'STD',
    text: 'std',
  },
]

interface DimensionFunction {
  text: string;
  value: string;
  convert: (f: string) => string;
  time: boolean | object;
}

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


export const dimensionFunctions: DimensionFunctions<DimensionFunction> = DimensionFunctions.create<DimensionFunction>()
dimensionFunctions.push(...[
  {
    text: 'none',
    value: '(no grouping / buckets)',
    convert: (f: string) => f,
    time: false,
  },

  {
    text: 'date',
    value: 'DATE',
    convert: (f: string) => `DATE(${f})`,
    time: { unit: 'day', minUnit: 'day', round: true },
  },

  {
    text: 'week',
    value: 'WEEK',
    convert: (f: string) => `DATE(${f})`,
    time: { unit: 'week', minUnit: 'week', round: true, isoWeekday: true },
  },

  {
    text: 'month',
    value: 'MONTH',
    convert: (f: string) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'month', minUnit: 'month', round: true },
  },

  {
    text: 'quarter', // fetch monthly aggregation but tell renderer to group by quarter
    value: 'QUARTER',
    convert: (f: string) => `DATE_FORMAT(${f}, '%Y-%m-01')`,
    time: { unit: 'quarter', minUnit: 'quarter', round: true },
  },

  {
    text: 'year',
    value: 'YEAR',
    convert: (f: string) => `DATE_FORMAT(${f}, '%Y-01-01')`,
    time: { unit: 'year', minUnit: 'year', round: true },
  },
])


export const predefinedFilters = [
  {
    value: 'YEAR(created_at) = YEAR(NOW())',
    text: 'recordsCreatedThisYear',
  },
  {
    value: 'YEAR(created_at) = YEAR(NOW()) - 1',
    text: 'recordsCreatedLastYear',
  },

  {
    value: 'YEAR(created_at) = YEAR(NOW()) AND QUARTER(created_at) = QUARTER(NOW())',
    text: 'recordsCreatedThisQuarter',
  },
  {
    value: 'YEAR(created_at) = YEAR(NOW()) - 1 AND QUARTER(created_at) = QUARTER(DATE_SUB(NOW(), INTERVAL 3 MONTH)',
    text: 'recordsCreatedLastQuarter',
  },

  {
    value: 'DATE_FORMAT(created_at, \'%Y-%m\') = DATE_FORMAT(NOW(), \'%Y-%m\')',
    text: 'recordsCreatedThisMonth',
  },
  {
    value: 'DATE_FORMAT(created_at, \'%Y-%m\') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 YEAR), \'%Y-%m\')',
    text: 'recordsCreatedLastMonth',
  },
]

dimensionFunctions.lookup = (d) => dimensionFunctions.find(f => d.modifier === f.value)
dimensionFunctions.convert = (d) => (dimensionFunctions.lookup(d) || {}).convert(d.field)


export const isRadialChart = ({ type }: KV) => type === 'doughnut' || type === 'pie'
export const hasRelativeDisplay = ({ type }: KV) => isRadialChart({ type })

export const makeDataLabel = ({
  prefix = '',
  value = 0,
  dataset = {},
  relativeValue = false,
  relativePrecision = 2,
  suffix = '',
}: any) => {
  let newValue = ''

  // If time dimension is provided, value is represented with a { y, t } object
  if (typeof value === 'object') {
    newValue = value.y || 0
  } else {
    newValue = `${value}`
  }

  if (relativeValue && hasRelativeDisplay({ type: dataset.type as ChartType })) {
    // get relative value
    const total = dataset.data.reduce((acc: number, cur: number) => acc + cur, 0)
    newValue = (value / total * 100).toFixed(parseInt(relativePrecision || 2))
    suffix = suffix || '%'
  }

  return `${prefix ? prefix + ': ' : ''}${(newValue)}${suffix}`
}

// Makes a standarised alias from modifier or dimension report option
export const makeAlias = ({ alias, aggregate, modifier, field }: Metric) => alias || `${aggregate || modifier || 'none'}_${field}`

const chartUtil = {
  dimensionFunctions,
  hasRelativeDisplay,
  aggregateFunctions,
  predefinedFilters,
  ChartType,
}

export {
  chartUtil,
}
