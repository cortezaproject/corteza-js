import { describe, it } from 'mocha'
import { expect } from 'chai'
import { AllowAccess, DenyAccess, AnyOf } from './permissions'

const aRole =
  Object.freeze({ roleID: '1234' })

const aResource =
  Object.freeze({ resourceID: 'thing:42' })

const anyResource =
  Object.freeze(AnyOf(aResource))

describe(__filename, () => {
  describe('AllowAccess class', () => {
    it('should properly convert resource', () => {
      const a = new AllowAccess(aRole, aResource, 'read')
      expect(a).to.deep.equal({
        access: 'allow',
        resource: 'thing:42',
        operation: 'read',
        role: '1234',
      })
    })

    it('should properly convert wildcard resource', () => {
      const a = new AllowAccess(aRole, anyResource, 'read')
      expect(a).to.deep.equal({
        access: 'allow',
        resource: 'thing:*',
        operation: 'read',
        role: '1234',
      })
    })
  })

  describe('DenyAccess class', () => {
    it('should properly convert resource', () => {
      const a = new DenyAccess(aRole, aResource, 'read')
      expect(a).to.deep.equal({
        access: 'deny',
        resource: 'thing:42',
        operation: 'read',
        role: '1234',
      })
    })

    it('should properly convert wildcard resource', () => {
      const a = new DenyAccess(aRole, anyResource, 'read')
      expect(a).to.deep.equal({
        access: 'deny',
        resource: 'thing:*',
        operation: 'read',
        role: '1234',
      })
    })
  })

  describe('AnyOf() specific resource to wildcard converter', () => {
    it('should convert standard resource id format', () => {
      expect(AnyOf({ resourceID: 'foo:42' })).to.have.property('resourceID').equal('foo:*')
    })
    it('should not covert service resource ID', () => {
      expect(AnyOf({ resourceID: 'foo' })).to.have.property('resourceID').equal('foo')
    })
    it('should keep wildcard if already there', () => {
      expect(AnyOf({ resourceID: 'foo:*' })).to.have.property('resourceID').equal('foo:*')
    })
    it('should silently handle resources ending with :', () => {
      expect(AnyOf({ resourceID: 'foo:' })).to.have.property('resourceID').equal('foo:*')
    })
  })
})
