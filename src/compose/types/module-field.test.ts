import { expect } from 'chai'
import { ModuleField } from './module-field'

describe('check module field casting', () => {
  it('simple assignment', () => {
    const f = new ModuleField({
      name: 'fname',
      kind: 'number',
    })

    expect(f.name).to.equal('fname')
  })
})
