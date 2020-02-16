import { PageBlock, PageBlockInput, Registry } from './base'
import { Button } from './types'

const kind = 'Automation'

interface Options {
  // Ordered list of buttons to display in the block
  buttons: Button[];

  // When true, new compatible buttons (ui-hooks) are NOT
  // added automatically to the block
  //
  // Default behaviour is to add new buttons automatically.
  sealed: boolean;
}

const defaults: Readonly<Options> = Object.freeze({
  buttons: [],
  sealed: false,
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
