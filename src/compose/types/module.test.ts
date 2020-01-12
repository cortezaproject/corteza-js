import { expect } from 'chai'
import { Module } from './module'
import { AreObjectsOf } from '../../guards'
import { ModuleField } from './module-field'

const mod = new Module({
  name: 'modName',

  fields: [
    { name: 'f1s', kind: 'string' },
    { name: 'f2b', kind: 'bool' },
    { name: 'f2n', kind: 'number' },
  ],
})

describe('check module casting', () => {
  it('simple assignment', () => {
    expect(mod.name).to.equal('modName')
    expect(mod.fields).to.be.lengthOf(3)
    expect(AreObjectsOf<ModuleField>(mod.fields, 'isSystem')).to.equal(true)
  })
})

describe('field operations', () => {
  it('simple search', () => {
    expect(mod.findField('f1s')).to.not.equal(undefined)
    expect(mod.findField('foo')).to.equal(undefined)
  })
})
