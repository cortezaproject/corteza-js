import { expect } from 'chai'
import { DummyHandler, Handler } from './handlers'
import { Dummy } from '../events/dummy'

describe('handler', () => {
  it('should match compatible event', () => {
    const h = new Handler(DummyHandler, { eventTypes: ['e1'], resourceTypes: ['r1'] })
    expect(h.Match(new Dummy({ resource: 'r1', event: 'e1' }))).to.equal(true)
  })

  it('should not match incompatible events', () => {
    const h = new Handler(DummyHandler, { eventTypes: ['e1'], resourceTypes: ['r1'] })
    expect(h.Match(new Dummy({ resource: 'r2', event: 'e1' }))).to.equal(false)
    expect(h.Match(new Dummy({ resource: 'r1', event: 'e2' }))).to.equal(false)
    expect(h.Match(new Dummy({ resource: 'r2', event: 'e2' }))).to.equal(false)
  })
})
