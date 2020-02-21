import { Apply } from '../../../cast'

export class Button {
  public script?: string = undefined

  // resource type (copied from ui hook)
  public resourceType?: string = undefined;

  // Can override hook's label
  public label?: string = undefined;

  // can override hooks's variant
  public variant?: string = undefined;

  public enabled = true;

  constructor (b: Partial<Button>) {
    Apply(this, b, Boolean, 'enabled')
    Apply(this, b, String, 'label', 'variant', 'script', 'resourceType')
  }
}

export type PageBlockWrap = 'Plain' | 'Card'
