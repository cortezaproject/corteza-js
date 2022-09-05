import { PageBlock, PageBlockInput, Registry } from './base'

const kind = 'Progress'

interface ValueOptions {
  moduleID: string;
  filter: string;
  field: string;
  aggregation: string;
}

interface Threshold {
  value: number;
  variant: string;
}

interface DisplayOptions {
  showValue: boolean;
  showRelative: boolean;
  showProgress: boolean;
  animated: boolean;
  variant: string;
  thresholds: Threshold[];
}

interface Options {
  value: ValueOptions;
  maxValue: ValueOptions;
  display: DisplayOptions;
}

const defaults: Readonly<Options> = Object.freeze({
  value: {
    moduleID: '',
    filter: '',
    field: '',
    aggregation: '',
  },

  maxValue: {
    moduleID: '',
    filter: '',
    field: '',
    aggregation: '',
  },

  display: {
    showValue: true,
    showRelative: true,
    showProgress: false,
    animated: false,
    variant: 'success',
    thresholds: [],
  },
})

export class PageBlockProgress extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    if (o.value) {
      this.options.value = o.value
    }

    if (o.maxValue) {
      this.options.maxValue = o.maxValue
    }

    if (o.display) {
      this.options.display = o.display
    }
  }
}

Registry.set(kind, PageBlockProgress)
