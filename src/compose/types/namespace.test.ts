import { expect } from 'chai'
import { Namespace } from './namespace'

describe('check namespace casting', () => {
  it('simple assignment', () => {
    const ns = new Namespace({
      name: 'ns name',
      enabled: true,
    })

    expect(ns.name).to.equal('ns name')
    expect(ns.enabled).to.equal(true)
  })
})
