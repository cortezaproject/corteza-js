import { describe, it } from 'mocha'
import { expect } from 'chai'
import { AllowAccess, AnyOf, DenyAccess, PermissionRule } from './permissions'

const aRole =
  Object.freeze({ roleID: '1234' })

const aResource =
  Object.freeze({ resourceID (): string { return 'thing:42' } })

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
})
