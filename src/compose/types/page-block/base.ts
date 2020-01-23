import { Apply } from '../../../cast'

interface PageBlockStyleVariants {
  [_: string]: string;
}

interface PageBlockStyle {
  variants: PageBlockStyleVariants;
}

interface PageBlockOptions {
  [_: string]: string;
}

export interface RawPageBlock {
  title?: string;
  description?: string;
  kind?: string;
  options?: PageBlockOptions;
  style?: PageBlockStyle;

  xywh?: number[];
}

export class PageBlock {
  public title = '';
  public description = '';

  xywh: number[] = []
  kind = ''

  public options = {}
  public style: PageBlockStyle = {
    variants: {},
  }

  constructor (i?: RawPageBlock | PageBlock) {
    this.apply(i)
  }

  apply (i?: RawPageBlock | PageBlock): void {
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
      this.xywh = i.xywh || [0, 0, 3, 3]
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
