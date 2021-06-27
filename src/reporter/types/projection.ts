import { reporter } from '../..'
import { Apply } from '../../cast'
import { Element, ElementFactory } from './element'

const defaultXYWH: () => [number, number, number, number] = () => [0, 0, 5, 5]

export class Projection {
  public title = ''
  public description = ''
  public layout = 'horizontal'
  public elements: Array<Element> = []

  public sources: Array<reporter.Step> = []

  xywh: number[] = defaultXYWH()

  constructor (p: Partial<Projection>) {
    if (!p) return

    Apply(this, p, String, 'title', 'description', 'layout')

    if (p.xywh) {
      if (!Array.isArray(p.xywh)) {
        throw new Error('xywh must be an array')
      }

      if (p.xywh.length !== 4) {
        throw new Error('xywh must have 4 elements')
      }

      this.xywh = p.xywh
    }

    this.elements = []
    if (p?.elements) {
      for (const e of p.elements) {
        this.elements.push(ElementFactory.Make(e))
      }
    }

    this.sources = []

    for (const s of p.sources || []) {
      this.sources.push(s as reporter.Step)
    }
  }
}
