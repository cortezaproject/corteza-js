import { expect } from 'chai'
import { RecordValidator } from './record'
import { Module } from '../types/module'
import { Record } from '../types/record'
import { Validated, ValidatorError } from '../../validator/validator'

const m = Object.freeze(new Module({
  fields: [
    { kind: 'String', name: 'simple' },
    { kind: 'String', name: 'required', isRequired: true },
    { kind: 'String', name: 'multi', isMulti: true },
    { kind: 'String', name: 'multiRequired', isRequired: true, isMulti: true },
  ],
}))

describe(__filename, () => {
  let r: Record, v: RecordValidator

  beforeEach(() => {
    r = new Record(m)
    v = new RecordValidator(m)
  })

  it('should return errors when required values are not set', () => {
    console.log(v.run(r).get())
    expect(v.run(r).get()).deep.members([
      new ValidatorError({ message: 'missing required value', meta: { field: 'required' } }),
      new ValidatorError({ message: 'missing required value', meta: { field: 'multiRequired' } }),
    ])
  })
})

describe('validator', () => {
  it('should properly filter by meta key', () => {
    const v = new Validated(
      new ValidatorError('foo'),
      new ValidatorError({ message: 'bar', meta: { bar: true } }),
      new ValidatorError({ message: 'baz', meta: { bar: false } }),
    )

    expect(v.filterByMeta('bar')).to.have.lengthOf(2)
    expect(v.filterByMeta('bar', true)).to.have.lengthOf(1)
    expect(v.filterByMeta('bar', false)).to.have.lengthOf(1)
  })
})
