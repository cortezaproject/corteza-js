import { PageBlock, RawPageBlock, Registry } from './base'

const kind = 'Automation'

interface Options {
  buttons: string[];
}

export class PageBlockAutomation extends PageBlock {
  readonly kind = kind

  options: Options = {
    buttons: [],
  }

  constructor (i?: PageBlock | RawPageBlock) {
    super(i)
    this.applyOptions(i?.options as Options)
  }

  applyOptions (o?: Options): void {
    if (!o) return

    if (o.buttons) {
      this.options.buttons = o.buttons
    }
  }
}

Registry.set(kind, PageBlockAutomation)
