import { EventBus } from './eventbus'
import { expect } from 'chai'
import { Dummy } from '../events/dummy'

describe('dispatching', () => {
  let eb: EventBus

  beforeEach(() => {
    eb = new EventBus()
  })

  it('should not raise any errors when dispatching w/o any registred handlers', () => {
    eb.Dispatch(new Dummy({ resource: 'res1', event: 'ev1' }))
  })

  it('should trigger registered handler', () => {
    let guineapig = 0
    const t = { eventTypes: ['e1'], resourceTypes: ['r1'] }
    const h = async (): Promise<undefined> => {
      guineapig = 42
      return undefined
    }

    expect(guineapig).to.equal(0)
    eb.Register(h, t).Dispatch(new Dummy({ resource: 'r1', event: 'e1' }))
    expect(guineapig).to.equal(42)
  })
})
