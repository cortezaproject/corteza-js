import { expect } from 'chai'
import { RecordValidator } from './record'
import { Module } from '../types/module'
import { Record } from '../types/record'
import { Validated, ValidatorError } from '../../validator/validator'

const m = Object.freeze(new Module({
  fields: [
    { name: 'simple' },
    { name: 'required', isRequired: true, kind: 'String' },
    { name: 'multi', isMulti: true },
    { name: 'multiRequired', isRequired: true, isMulti: true },
  ],
}))

describe('record validation', () => {
  let r: Record, v: RecordValidator

  beforeEach(() => {
    r = new Record(m)
    v = new RecordValidator(m)
  })

  it('should return errors when required values are not set', () => {
    expect(v.run(r).get()).deep.members([
      { message: 'missing required value', meta: { field: 'required' } },
      { message: 'missing required value', meta: { field: 'multiRequired' } },
    ])
  })
})

describe('validator', () => {
  it('should properly filter by meta key', () => {
    const v = new Validated(
      new ValidatorError('foo'),
      new ValidatorError('bar', { bar: true }),
      new ValidatorError('baz', { bar: false }),
    )

    expect(v.filterByMeta('bar')).to.have.lengthOf(2)
    expect(v.filterByMeta('bar', true)).to.have.lengthOf(1)
    expect(v.filterByMeta('bar', false)).to.have.lengthOf(1)
  })
})
