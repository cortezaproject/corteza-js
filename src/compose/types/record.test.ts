import { expect } from 'chai'
import { Record, Values } from './record'
import { Module } from './module'

const m = Object.freeze(new Module({
  fields: [
    { name: 'simple' },
    { name: 'required', isRequired: true },
    { name: 'multi', isMulti: true },
    { name: 'multiRequired', isRequired: true, isMulti: true },
  ],
}))

describe('record creation', () => {
  const assertAllUndefined = function (r: Record): void {
    expect(r.module).to.eq(m)
    expect(r.values.simple).to.be.undefined
    expect(r.values.required).to.be.undefined
    expect(r.values.multi).to.be.undefined
    expect(r.values.multiRequired).to.be.undefined
  }

  const assertSimpleSet = function (r: Record): void {
    expect(r.module).to.eq(m)
    expect(r.values.simple).to.eq('foo')
    expect(r.values.multi).to.deep.eq(['bar'])
  }

  const values: Values = { simple: 'foo', multi: ['bar'] }
  const rawValues = [
    { name: 'simple', value: 'foo' },
    { name: 'multi', value: 'bar' },
  ]

  it('module only', () => {
    assertAllUndefined(new Record(m))
  })

  it('module with empty object', () => {
    assertAllUndefined(new Record(m, {}))
  })

  it('empty object with module', () => {
    assertAllUndefined(new Record({}, m))
  })

  it('module with non-empty values object', () => {
    assertSimpleSet(new Record(m, values))
  })

  it('non-empty values object with module', () => {
    assertSimpleSet(new Record(values, m))
  })

  it('module with non-empty raw values', () => {
    assertSimpleSet(new Record(m, rawValues))
  })

  it('raw values with module', () => {
    assertSimpleSet(new Record(rawValues, m))
  })
})

describe('value setting', () => {
  let r: Record
  beforeEach(() => {
    r = new Record(m)
  })

  it('should properly set from values object', () => {
    r.setValues({ simple: 'foo' })
    expect(r.values.simple).to.eq('foo')
  })

  it('should properly set from array of values objects', () => {
    r.setValues([{ simple: 'foo' }])
    expect(r.values.simple).to.eq('foo')
  })

  it('should properly set from array of raw-values objects', () => {
    r.setValues([{ name: 'simple', value: 'foo' }])
    expect(r.values.simple).to.eq('foo')
  })

  it('should properly set multiple values via values to a non-multi-value field', () => {
    r.setValues({ simple: ['bar', 'baz'] })
    expect(r.values.simple).to.eq('bar')
  })

  it('should properly set value via values to a multi-value field', () => {
    r.setValues({ multi: 'bar' })
    expect(r.values.multi).to.deep.eq(['bar'])
  })

  it('should properly set multiple values via raw-values to a non-multi-value field', () => {
    r.setValues([{ name: 'simple', value: 'foo' }, { name: 'simple', value: 'foo' }])
    expect(r.values.simple).to.eq('foo')
  })

  it('should properly set value via raw-values to a multi-value field', () => {
    r.setValues([{ name: 'multi', value: 'bar' }])
    expect(r.values.multi).to.deep.eq(['bar'])
  })
})

describe('JSON serialization', () => {
  let r: Record
  beforeEach(() => {
    r = new Record(m)
  })

  it('should properly serialize whole record', () => {
    r.setValues([{ simple: 'foo', multi: ['bar', 'baz'] }])
    expect(JSON.stringify(r)).to.equal(
      '{"recordID":"0","moduleID":"0","namespaceID":"0",' +
      '"values":[{"name":"simple","value":"foo"},{"name":"multi","value":"bar"},{"name":"multi","value":"baz"}],' +
      '"ownedBy":"0","createdBy":"0","updatedBy":"0","deletedBy":"0"}')
  })

  it('serialization magic should sustain object manipulation', () => {
    r.setValues([{ simple: 'foo', multi: ['bar', 'baz'] }])
    const { values } = r

    expect(JSON.stringify(values)).to.equal(
      '[{"name":"simple","value":"foo"},{"name":"multi","value":"bar"},{"name":"multi","value":"baz"}]')
  })
})
