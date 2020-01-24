import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'Content'

interface Options {
  body: string;
}

export class PageBlockContent extends PageBlock {
  readonly kind = kind

  options: Options = {
    body: '',
  }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'body')
  }
}

Registry.set(kind, PageBlockContent)
