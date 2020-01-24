import { PageBlock, RawPageBlock, Registry } from './base'
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

  constructor (i?: PageBlock | RawPageBlock) {
    super(i)
    this.applyOptions(i?.options as Options)
  }

  applyOptions (o?: Options): void {
    if (!o) return

    Apply(this.options, o, String, 'body')
  }
}

Registry.set(kind, PageBlockContent)
