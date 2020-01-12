import { expect } from 'chai'
import { IsEmpty, MergeValidated, StandardModuleFieldValidator, Validator, ValidatorError } from './record-validation'
import { Record } from './types/record'
import { Module } from './types/module'
import { ModuleField } from './types/module-field'

const m = new Module({
  fields: [
    { name: 'simple' },
    { name: 'required', isRequired: true },
  ],
})

describe('validator merging', () => {
  it('should skip true values', () => {
    const v = MergeValidated(new Map(), 'foo', true)
    expect(v).to.have.lengthOf(0)
  })

  it('should not skip false values', () => {
    const v = MergeValidated(new Map(), 'foo', false)
    expect(v).to.have.keys(['foo'])
  })

  it('should merge Error', () => {
    const v = MergeValidated(new Map(), 'foo', new ValidatorError('test'))
    expect(v).to.have.keys(['foo'])
  })

  it('should merge array of Error', () => {
    const v = MergeValidated(new Map(), 'foo', [new ValidatorError('test'), new ValidatorError('test')])
    expect(v).to.have.keys(['foo'])
  })

  it('should merge map of validations', () => {
    const p = new Map([['bar', [new ValidatorError('error')]]])
    const v = MergeValidated(new Map(), 'foo', p)
    expect(v).to.have.keys(['bar'])
    expect(v).not.to.have.keys(['foo'])
  })
})

describe('empty value checker', () => {
  it('should properly handle empty string', () => {
    expect(IsEmpty('')).to.equal(true)
  })

  it('should properly handle empty string', () => {
    expect(IsEmpty('foo')).to.equal(false)
  })

  it('should properly handle empty array', () => {
    expect(IsEmpty([])).to.equal(true)
  })

  it('should properly handle array with string', () => {
    expect(IsEmpty([''])).to.equal(true)
  })

  it('should properly handle array with non-empty string', () => {
    expect(IsEmpty(['foo'])).to.equal(false)
  })
})

describe('standard module field validator', () => {
  it('no errors on a simple filed', () => {
    const f = m.findField('simple') as ModuleField
    expect(StandardModuleFieldValidator.call(f, '')).to.have.lengthOf(0)
  })

  it('raise errors on empty value for required field', () => {
    const f = m.findField('required') as ModuleField
    expect(StandardModuleFieldValidator.call(f, '')).to.have.lengthOf(1)
  })

  it('do not raise error on non-empty value for required field', () => {
    const f = m.findField('required') as ModuleField
    expect(StandardModuleFieldValidator.call(f, 'foo')).to.have.lengthOf(0)
  })
})

describe('basic operations', () => {
  let v: Validator, r: Record

  beforeEach(() => {
    v = new Validator()
    r = new Record(m)
  })

  it('should not yield any errors w/o registered validators', () => {
    expect(v.run(r)).not.to.have.keys('required', 'simple')
  })

  it('should yield errors with registered validators', () => {
    v.addField(StandardModuleFieldValidator, ...m.fields)
    expect(v.run(r)).to.have.keys('required')
    expect(v.run(r)).not.to.have.keys('simple')
  })

})
