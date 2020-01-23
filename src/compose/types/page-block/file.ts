import { PageBlock, RawPageBlock, Registry } from './base'

const kind = 'File'

interface Options {
  mode: string;
  attachments: string[];
}

const PageBlockFileDefaultMode = 'list'
const PageBlockFileModes = [
  // list of attachments, no preview
  'list',
  // grid of icons
  'grid',
  // single (first) image/file, show preview
  'single',
  // list of all images/files, show preview
  'gallery',
]

export class PageBlockFile extends PageBlock {
  readonly kind = kind

  options: Options = {
    mode: PageBlockFileDefaultMode,
    attachments: [],
  }

  constructor (i?: PageBlock | RawPageBlock) {
    super(i)
    this.applyOptions(i?.options as Options)
  }

  applyOptions (o?: Options): void {
    if (!o) return

    if (o.attachments) {
      this.options.attachments = o.attachments
    }

    if (o.mode) {
      if (PageBlockFileModes.includes(o.mode)) {
        this.options.mode = o.mode
      } else {
        o.mode = PageBlockFileDefaultMode
      }
    }
  }
}

Registry.set(kind, PageBlockFile)
