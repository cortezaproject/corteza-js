import { reporter } from '../..'
import { Apply } from '../../cast'
import { Element, ElementFactory } from './element'
import { RowDefinition } from './filter'

const defaultXYWH = [0, 0, 3, 3]

export class Projection {
  public title = ''
  public description = ''
  public layout = 'horizontal'
  // The key is used when generating the model names.
  // The key is automatically implied if not provided.
  public key = ''
  public elements: Array<Element> = []

  public sources: Array<reporter.Step> = []

  xywh: number[] = defaultXYWH

  constructor (p: Partial<Projection>) {
    if (!p) return

    Apply(this, p, String, 'title', 'description', 'layout', 'key')

    if (p.xywh) {
      if (!Array.isArray(p.xywh)) {
        throw new Error('xywh must be an array')
      }

      if (p.xywh.length !== 4) {
        throw new Error('xywh must have 4 elements')
      }

      // by default, park 3x3 block in upper left corner
      this.xywh = p.xywh || defaultXYWH
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

  // reportDefinitions provides the parameters extracted from the projections
  // reportDefinitions (): { model: Array<Step>; dataset: Array<DatasetDefinition> } {
  //   const model: Array<Step> = []
  //   const dataset: Array<DatasetDefinition> = []

  //   for (const e of this.elements) {
  //     const d = e.reportDefinitions(this.projectionKey)
  //     model.push(...d.model)
  //     dataset.push(...d.dataset)
  //   }

  //   return { model, dataset }
  // }

  get projectionKey (): string {
    return this.key
  }
}
