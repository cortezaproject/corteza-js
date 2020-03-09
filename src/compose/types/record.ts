/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { AreObjectsOf, IsOf } from '../../guards'
import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { Module } from './module'
import { Namespace } from './namespace'

const fieldIndex = Symbol('fieldIndex')
const propModule = Symbol('module')
const cleanValues = Symbol('cleanValues')

const reservedFieldNames = [
  'toJSON',
]

interface FieldIndex {
  isMulti: boolean;
  kind: string;
  defaultValue: Array<{ value: string }>;
}

interface RawValue {
  name: string;
  value: string;
}

interface PartialRecord extends Partial<Omit<Record, 'values' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
  values?: RawValue[];

  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
}

export interface Values {
  [name: string]: string|string[]|undefined;
}

type ValueCombo = RawValue | RawValue[] | Values | Values[]
type RecordCtorCombo = Record | Module | PartialRecord | ValueCombo

/**
 * For something to be useful module (for a Record), it needs to contain fields
 */
function isModule (m?: unknown): m is Module {
  return m && IsOf<Module>(m, 'fields') && Array.isArray(m.fields) && m.fields.length > 0
}

function isRawValue (v: unknown): v is RawValue {
  return IsOf<RawValue>(v, 'name', 'value')
}

/**
 * Record class will be used all over the place, user scripts, etc..
 *
 * Constructor (and apply fn) is as versatile as possible to handle
 * different use-cases.
 */
export class Record {
  public recordID = NoID;
  public moduleID = NoID;
  public namespaceID = NoID;

  public values: Values = {}

  public createdAt?: Date = undefined;
  public updatedAt?: Date = undefined;
  public deletedAt?: Date = undefined;

  public ownedBy = NoID;
  public createdBy = NoID;
  public updatedBy = NoID;
  public deletedBy = NoID;

  private [fieldIndex]: Map<string, FieldIndex>
  private [propModule]?: Module
  private [cleanValues]: Values = {}

  constructor (recModVal1: RecordCtorCombo, recModVal2?: RecordCtorCombo) {
    if (recModVal1 instanceof Record) {
      this.module = recModVal1.module
      this.apply(recModVal1)
      return
    }

    if (isModule(recModVal1)) {
      this.module = recModVal1
      this.apply(recModVal2)
      return
    }

    if (isModule(recModVal2)) {
      this.module = recModVal2
      this.apply(recModVal1)
      return
    }

    throw new Error('invalid module used to initialize a record')
  }

  clone (): Record {
    return new Record(JSON.parse(JSON.stringify(this)))
  }

  apply (p?: unknown): void {
    if (p === undefined) return

    let r

    // Determine what kind of value we got
    switch (true) {
      case IsOf<Record>(p, 'recordID') || IsOf<Record>(p, 'values'):
        // p1 is something that looks like a record object
        r = p as Record
        break

      case AreObjectsOf<RawValue>(p, 'name'):
        // assuming p1 is array of raw values
        r = ({ values: p as RawValue[] }) as PartialRecord
        break

      default:
        r = ({ values: p }) as Record
    }

    r = r as PartialRecord

    if (this.module && r.moduleID && r.moduleID !== this.module.moduleID) {
      throw new Error('can not change module on a record')
    }

    if (this.namespace && r.namespaceID && r.namespaceID !== this.namespace.namespaceID) {
      throw new Error('can not change namespace on a record')
    }

    if (r.namespaceID && r.namespaceID !== this.module.namespaceID) {
      throw new Error('record and module namespace do not match')
    }

    Apply(this, r, CortezaID, 'recordID', 'moduleID', 'namespaceID')
    Apply(this, r, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, r, CortezaID, 'ownedBy', 'createdBy', 'updatedBy', 'deletedBy')

    if (r.values !== undefined) {
      this.updateValues(r.values)
    }

    if (!this[cleanValues]) {
      // When there are no clean values,
      // make copy of values so that we know if change occurred
      this[cleanValues] = Object.freeze({ ...this.values })
    }
  }

  public get cleanValues (): Values {
    return this[cleanValues]
  }

  public get module (): Module {
    if (this[propModule] === undefined) {
      throw new Error('module not set')
    }

    return this[propModule] as Module
  }

  public set module (m: Module) {
    if (this[propModule]) {
      if ((this[propModule] as Module).moduleID !== m.moduleID) {
        throw new Error('module for this record already set')
      }
    }

    if (!m.fields || !Array.isArray(m.fields) || m.fields.length === 0) {
      throw new Error('module used to initialize a record does not contain any fields')
    }

    this.moduleID = m.moduleID
    this.namespaceID = m.namespaceID

    this[fieldIndex] = new Map()

    if (Object.isFrozen(m)) {
      this[propModule] = m
    } else {
      // Making a copy and freezing it
      this[propModule] = Object.freeze(new Module(m))
    }

    (this[propModule] as Module).fields.forEach(f => {
      const {
        name,
        isMulti,
        kind,
        defaultValue,
      } = f

      if (reservedFieldNames.includes(name)) {
        throw new Error('can not use reserved field name ' + name)
      }

      this[fieldIndex].set(name, { isMulti, kind, defaultValue })
    })

    Object.freeze(this[fieldIndex])

    this.initValues()
  }

  public get namespace (): Namespace {
    return this.module.namespace
  }

  /**
   * Converts internal representation of values into array of RawValue objects
   */
  serializeValues (): RawValue[] {
    const vv: RawValue[] = []

    this[fieldIndex].forEach(({ isMulti }, name) => {
      if (this.values[name] === undefined) {
        return
      }

      const val = this.values[name] as string|string[]

      if (isMulti) {
        if (Array.isArray(this.values[name])) {
          for (let i = 0; i < val.length; i++) {
            if (val[i] !== undefined) {
              vv.push({ name, value: val[i].toString() })
            }
          }
        }
      } else {
        vv.push({ name, value: val.toString() })
      }
    })

    return vv
  }

  // Removes and resets all values
  public setValues (...i: ValueCombo[]): void {
    this.initValues()
    this.updateValues(...i)
  }

  /**
   * Makes destination values
   */
  protected initValues (): void {
    const dst: Values = {}
    // TypeScript complains about incompatibility between
    // indexed object and toJSON function
    // @ts-ignore
    dst.toJSON = (): RawValue[] => this.serializeValues()

    this[fieldIndex].forEach(({ isMulti, defaultValue }, name) => {
      if (defaultValue && Array.isArray(defaultValue) && defaultValue.length > 0) {
        if (isMulti) {
          dst[name] = defaultValue.map(({ value }) => value)
        } else {
          dst[name] = defaultValue[0].value
        }
      } else if (isMulti) {
        dst[name] = []
      } else {
        dst[name] = undefined
      }
    })

    this.values = dst
  }

  /**
   * Updates record's values object with provided input
   */
  protected updateValues (...combo: ValueCombo[]): void {
    combo.forEach(v => {
      if (Array.isArray(v)) {
        this.updateValues(...v)
        return
      }

      if (isRawValue(v)) {
        const { name, value } = v
        this.setValue(name, value)
        return
      }

      if (!v || typeof v !== 'object') {
        throw Error('expecting array of values or values object')
      }

      // Handle Values
      for (const name of Object.getOwnPropertyNames(v)) {
        this.setValue(name, v[name])
      }
    })
  }

  /**
   * Sets single value
   *
   * @param name
   * @param value
   */
  public setValue (name: string, value: undefined|string|string[], index = -1): void {
    // Skip reserved names
    if (reservedFieldNames.includes(name)) {
      return
    }

    // Skip unknown fields
    if (!this[fieldIndex].has(name)) {
      return
    }
    const { isMulti } = this[fieldIndex].get(name) as FieldIndex

    if (value === undefined || value.length === 0) {
      // nothing given, nothing set
      this.values[name] = isMulti ? [] : undefined
      return
    }

    if (isMulti) {
      if (Array.isArray(value)) {
        if (index < -1) {
          // assigning [] to [i]
          throw Error('can not set array of values to a single value')
        }

        this.values[name] = Array.isArray(value) ? value : [value]
        return
      }

      if (index === -1) {
        (this.values[name] as string[]).push(value)
        return
      }

      (this.values[name] as string[])[index] = value
      return
    }

    if (Array.isArray(value)) {
      value = value[0]
    }

    // Update with first item or set to undefined
    this.values[name] = value
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.recordID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'compose:record'
  }
}
