import { expect } from 'chai'
import { AreBooleans, AreNumbers, AreObjects, AreObjectsOf, AreStrings, IsOf } from './guards'

class Foo { baz = '' }

describe('check if variable is of certain type', () => {
  it('should properly validate native and user types', () => {
    const foo = new Foo()
    const fff = 'some string'

    expect(IsOf<Foo>(foo, 'baz')).to.equal(true)
    expect(IsOf(foo, 'baz')).to.equal(true)
    expect(IsOf(foo, 'bar')).to.equal(false)
    expect(IsOf(fff, 'bar')).to.equal(false)

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(IsOf<Foo>(foo, 'bar')).to.equal(false)
  })
})

describe('check if array items are of certain type', () => {
  it('should properly validate user types', () => {
    expect(AreObjectsOf<Foo>([], 'baz')).to.equal(true)
    expect(AreObjectsOf<Foo>([new Foo()], 'baz')).to.equal(true)
    expect(AreObjectsOf<Foo>([false], 'baz')).to.equal(false)
    expect(AreObjectsOf<Foo>(['some string'], 'baz')).to.equal(false)
    expect(AreObjectsOf<Foo>([new Foo(), 'string'], 'baz')).to.equal(false)
  })
})

describe('guards for native types', () => {
  it('should properly validate empty arrays', () => {
    expect(AreStrings([])).to.equal(true)
    expect(AreBooleans([])).to.equal(true)
    expect(AreNumbers([])).to.equal(true)
    expect(AreObjects([])).to.equal(true)
  })

  it('should properly validate invalid types', () => {
    expect(AreStrings([undefined])).to.equal(false)
    expect(AreBooleans([undefined])).to.equal(false)
    expect(AreNumbers([undefined])).to.equal(false)
    expect(AreObjects([undefined])).to.equal(false)
  })

  it('should properly validate valid types', () => {
    expect(AreStrings(['string'])).to.equal(true)
    expect(AreBooleans([true])).to.equal(true)
    expect(AreNumbers([42])).to.equal(true)
    expect(AreObjects([{}])).to.equal(true)
    expect(AreObjects([new Foo()])).to.equal(true)
  })
})
