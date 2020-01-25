import { Apply } from '../../../cast'

interface PageBlockStyleVariants { [_: string]: string }
interface PageBlockStyle { variants: PageBlockStyleVariants }

export type PageBlockInput = PageBlock | Partial<PageBlock>

const defaultXYWH = [0, 0, 3, 3]

export class PageBlock {
  public title = '';
  public description = '';

  xywh: number[] = defaultXYWH
  kind = ''

  public options = {}
  public style: PageBlockStyle = {
    variants: {},
  }

  constructor (i?: PageBlockInput) {
    this.apply(i)
  }

  clone (): PageBlock {
    return new PageBlock(JSON.parse(JSON.stringify(this)))
  }

  apply (i?: PageBlockInput): void {
    if (!i) return

    Apply(this, i, String, 'title', 'description')

    if (i.xywh) {
      if (!Array.isArray(i.xywh)) {
        throw new Error('xywh must be an array')
      }

      if (i.xywh.length !== 4) {
        throw new Error('xywh must have 4 elements')
      }

      // by default, park 3x3 block in upper left corner
      this.xywh = i.xywh || defaultXYWH
    }

    if (i.options) {
      // Object.assign(this.options, i.options)
    }

    if (i.style) {
      Object.assign(this.style, i.style)
    }
  }
}

export const Registry = new Map<string, typeof PageBlock>()
