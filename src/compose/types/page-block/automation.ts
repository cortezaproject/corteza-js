import { PageBlock, PageBlockInput, Registry } from './base'

const kind = 'Automation'

interface Options {
  buttons: string[];
}

const defaults: Readonly<Options> = Object.freeze({
  buttons: [],
})

export class PageBlockAutomation extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    if (o.buttons) {
      this.options.buttons = o.buttons
    }
  }
}

Registry.set(kind, PageBlockAutomation)
