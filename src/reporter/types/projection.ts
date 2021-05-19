import { Apply } from '../../cast'
import { DatasetDefinition } from './dataset'
import { Element, ElementFactory } from './element'
import { Step } from './step'

export class Projection {
  public name = ''
  public description = ''
  // The key is used when generating the model names.
  // The key is automatically implied if not provided.
  public key = ''
  public elements: Array<Array<Element>> = []

  constructor (p: Partial<Projection>) {
    Apply(this, p, String, 'name', 'description', 'key')

    if (p?.elements) {
      this.elements = []
      for (const ee of p.elements) {
        const tmp: Array<Element> = []
        for (const e of ee) {
          tmp.push(ElementFactory.Make(e))
        }
        this.elements.push(tmp)
      }
    }
  }

  // reportDefinitions provides the parameters extracted from the projections
  reportDefinitions (): { model: Array<Step>; dataset: Array<DatasetDefinition> } {
    const model: Array<Step> = []
    const dataset: Array<DatasetDefinition> = []

    for (const ee of this.elements) {
      for (const e of ee) {
        const d = e.reportDefinitions(this.projectionKey)
        model.push(...d.model)
        dataset.push(...d.dataset)
      }
    }

    return { model, dataset }
  }

  get projectionKey (): string {
    return this.key
  }
}
