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

type RecordCtorCombo = Record | Module | RawValue | RawValue[] | PartialRecord | Values | Values[]

/**
 * For something to be useful module (for a Record), it needs to contain fields
 */
function isModule (m?: unknown): m is Module {
  return m && IsOf<Module>(m, 'fields') && Array.isArray(m.fields) && m.fields.length > 0
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
      this.prepareValues(r.values)
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

    this.values = this.initValues()
  }

  public get namespace (): Namespace {
    return this.module.namespace
  }

  /**
   * Converts internal representation of values into array of RawValue objects
   */
  serializeValues (iv = this.values): RawValue[] {
    const vv: RawValue[] = []

    this[fieldIndex].forEach(({ isMulti }, name) => {
      if (iv[name] === undefined) {
        return
      }

      const val = iv[name] as string|string[]

      if (isMulti) {
        if (Array.isArray(iv[name])) {
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

  public setValues (input?: Values|Values[]|RawValue[]): void {
    if (input) {
      this.prepareValues(input)
    }
  }

  /**
   * Makes destination values
   */
  protected initValues (): Values {
    const dst: Values = {}
    // TypeScript complains about incompatibility between
    // indexed object and toJSON function
    // @ts-ignore
    dst.toJSON = (): RawValue[] => this.serializeValues(dst)

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

    return dst
  }

  /**
   * Updates record's values object with provided input
   */
  protected prepareValues (src: Values|Values[]|RawValue[], dst = this.values): void {
    if (AreObjectsOf<RawValue>(src, 'name')) {
      // Assign values from RawValues to Values like struct
      src = src.reduce((vv, { name, value }) => {
        vv[name] = value
        return vv
      }, {} as Values)
    } else if (Array.isArray(src)) {
      // Merge all given Values objects
      src = src.reduce((vv, v) => {
        for (const name of Object.getOwnPropertyNames(v)) {
          vv[name] = v[name]
        }

        return vv
      }, {} as Values)
    } else if (typeof src !== 'object') {
      throw Error('expecting array of values or values object')
    }

    // src is now aggregated (and narrowed to Values)
    // we need to make sure only valid fields are assigned to values
    for (const name of Object.getOwnPropertyNames(src)) {
      // Skip reserved names
      if (reservedFieldNames.includes(name)) {
        continue
      }

      // Skip unknown fields
      if (!this[fieldIndex].has(name)) {
        continue
      }

      const { isMulti } = this[fieldIndex].get(name) as FieldIndex

      if (isMulti && !Array.isArray(src[name])) {
        // help assigning single value to a multi-value field
        dst[name] = [src[name] as string]
      } else if (!isMulti && Array.isArray(src[name]) && src[name] && src[name]!.length > 0) {
        // help assigning single value to a multi-value field
        dst[name] = src[name]![0]
      } else {
        dst[name] = src[name]
      }
    }
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
