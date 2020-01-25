import { PageBlock, PageBlockInput, Registry } from './base'

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

const defaults: Readonly<Options> = Object.freeze({
  mode: PageBlockFileDefaultMode,
  attachments: [],
})

export class PageBlockFile extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
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
