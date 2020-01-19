import { expect } from 'chai'
import { IsEmpty, NormalizeValidatorResults, Validated, ValidatorError } from './validator'

describe('ValidatorError class', () => {
  it('should properly construct from a simple string', () => {
    const err = new ValidatorError('foo')
    expect(err).to.have.property('message').equal('foo')
    expect(err).to.not.have.property('i18n')
    expect(err).to.have.property('meta').empty
  })

  it('should properly construct from a simple string and meta', () => {
    const err = new ValidatorError('foo', { bar: 'baz' })
    expect(err).to.have.property('message').equal('foo')
    expect(err).to.not.have.property('i18n')
    expect(err).to.have.property('meta').deep.equal({ bar: 'baz' })
  })

  it('should properly construct from a object', () => {
    const err = new ValidatorError({ message: 'foo', meta: { bar: 'baz' } })
    expect(err).to.have.property('message').equal('foo')
    expect(err).to.not.have.property('i18n')
    expect(err).to.have.property('meta').deep.equal({ bar: 'baz' })
  })
})

describe('NormalizeValidatorResults()', () => {
  it('should be empty on no args', () => {
    expect(NormalizeValidatorResults()).to.be.empty
  })

  it('should be empty on true', () => {
    expect(NormalizeValidatorResults(true)).to.be.empty
  })

  it('should be empty on null', () => {
    expect(NormalizeValidatorResults(null)).to.be.empty
  })

  it('should be empty on empty array', () => {
    expect(NormalizeValidatorResults([])).to.be.empty
  })

  it('should result in array with one error when given an object', () => {
    expect(NormalizeValidatorResults({ message: 'foo' }))
      .to.have.lengthOf(1)
  })

  it('should result in complex array', () => {
    expect(NormalizeValidatorResults(
      { message: 'foo' },
      { message: 'foo' },
    )).to.have.lengthOf(2)
  })
})

describe('IsEmpty()', () => {
  it('should properly handle empty string', () => {
    expect(IsEmpty('')).to.equal(true)
  })

  it('should properly handle string value', () => {
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

describe('Validated class', () => {
  it('should not add errors when merging [validated] objects', () => {
    const v = new Validated()
    expect(v.length).to.equal(0)
    expect(v.get().length).to.equal(0)
    v.push(new Validated())
    expect(v.length).to.equal(0)
  })
})
