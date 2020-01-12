import { Module } from './module'
import { AreObjectsOf, IsOf } from '../../guards'
import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { StandardModuleFieldValidator, Validated, Validator } from '../record-validation'

const fieldIndex = Symbol('fieldIndex')
const propModule = Symbol('module')

const reservedFieldNames = [
  'toJSON',
]

interface FieldIndex {
  isMulti: boolean;
  kind: string;
  defaultValue: string|string[]|undefined;
}

interface RawValue {
  name: string;
  value: string;
}

interface RawRecord {
  recordID?: string;
  moduleID?: string;
  namespaceID?: string;

  values?: RawValue[];

  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
}

export interface Values {
  [name: string]: string|string[];
}

type RecordCtorCombo = Record | Module | RawValue | RawValue[] | RawRecord | Values | Values[]

/**
 * Record class will be used all over the place, user scripts, etc..
 *
 * Constructor (and apply fn) is as versatile as possible to handle
 * different use-cases.
 */
class Record {
  public recordID = NoID;
  public moduleID = NoID;
  public namespaceID = NoID;

  public values: Values = {}
  public cleanValues: Values = {}

  public createdAt?: Date = undefined;
  public updatedAt?: Date = undefined;
  public deletedAt?: Date = undefined;

  public ownedBy = NoID;
  public createdBy = NoID;
  public updatedBy = NoID;
  public deletedBy = NoID;

  private [fieldIndex]: Map<string, FieldIndex>
  private [propModule]?: Module

  constructor (recModVal1: RecordCtorCombo, recModVal2?: RecordCtorCombo) {
    let r, m

    this.values.foo = 'bae'

    // switch will check for p1 type variants
    switch (true) {
      // recModVal1 is module,
      // expecting recModVal2 to be something we can use as a record
      case IsOf<Module>(recModVal1, 'fields'):
        m = recModVal1
        r = recModVal2
        break

      // p1 looks like a record,
      // try to resolve a module
      case IsOf<Record>(recModVal1, 'values'):
        r = recModVal1 as Record
        if (recModVal2 && IsOf<Module>(recModVal2, 'fields')) {
          // module is passed as the 2nd argument
          m = recModVal2
        } else if (!recModVal2) {
          // module was not explicitly passed, can we take it out of record?
          m = r.module
        }
        break
    }

    this.module = m as Module
    this.apply(r)
  }

  apply (p?: unknown): void {
    if (!p) return

    let r

    // Determine what kind of value we got
    switch (true) {
      case typeof p === 'object' && Object.prototype.hasOwnProperty.call(p, 'values'):
        // p1 is something that looks like a record object
        r = p as Record
        break

      case AreObjectsOf(p, 'name'):
        // assuming p1 is array of raw values
        r = ({ values: p as RawValue[] }) as RawRecord
        break

      default:
        r = ({ values: p }) as Record
    }

    r = r as RawRecord|Record

    Apply(this, r, CortezaID, 'recordID', 'moduleID', 'namespaceID')
    Apply(this, r, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, r, CortezaID, 'ownedBy', 'createdBy', 'updatedBy', 'deletedBy')

    if (r.values) {
      this.prepareValues(r.values, this.values)

      // Make copy of values so that we know if it changed
      this.cleanValues = Object.freeze({ ...this.values })
    }
  }

  public get module (): Module {
    if (this[propModule] === undefined) {
      throw new Error('module not set')
    }

    return this[propModule] as Module
  }

  public set module (m: Module) {
    if (!m) {
      throw new Error('invalid module used to initialize a record')
    }

    if (!m.fields || !Array.isArray(m.fields) || m.fields.length === 0) {
      throw new Error('module used to initialize a record does not contain any fields')
    }

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
  }

  // [resetValues] () {
  //   let values = {
  //     toJSON: () => {
  //       // Remove unneeded properties
  //       return this.serializeValues()
  //     },
  //   }
  //
  //   this.module.fields.forEach(({ name, isMulti, kind }) => {
  //     values[name] = isMulti ? [] : undefined
  //   })
  //
  //   this.values = values
  // }

  /**
   * Converts internal representation of values into array of RawValue objects
   */
  serializeValues (iv = this.values): RawValue[] {
    const vv: RawValue[] = []

    this[fieldIndex].forEach(({ isMulti }, name) => {
      if (isMulti) {
        if (Array.isArray(iv[name])) {
          for (let i = 0; i < iv[name].length; i++) {
            if (iv[name][i] !== undefined) {
              vv.push({ name, value: iv[name][i].toString() })
            }
          }
        }
      } else if (iv[name] !== undefined) {
        vv.push({ name, value: iv[name].toString() })
      }
    })

    return vv
  }

  public setValues (input?: Values|Values[]|RawValue[]) {
    if (input) {
      this.prepareValues(input, this.values)
    }
  }

  /**
   * Updates record's values object with provided input
   */
  private prepareValues (src: Values|Values[]|RawValue[], dst = this.values) {
    if (AreObjectsOf<RawValue>(src, 'name')) {
      // Assign values from RawValues to Values like struct
      src = src.reduce((vv, { name, value }) => {
        return vv
      }, {} as Values)
    } else if (Array.isArray(src)) {
      // Merge all given Values objects
      src = src.reduce((vv, v) => {
        for (const name in Object.getOwnPropertyNames(v)) {
          vv[name] = v[name]
        }

        return vv
      }, {} as Values)
    } else if (typeof src !== 'object') {
      throw Error('expecting array of values or values object')
    }

    // src is now aggregated (and narrowed to Values)
    // we need to make sure only valid fields are assigned to values
    for (const name in Object.getOwnPropertyNames(src)) {
      // Skip resevred names
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
      } else if (!isMulti && Array.isArray(src[name]) && src[name].length > 0) {
        // help assigning single value to a multi-value field
        dst[name] = src[name][0]
      } else {
        dst[name] = src[name]
      }
    }
  }

  /**
   * Validates record values
   *
   * @param {Validator} additional validators for fields
   * @param {...string[]} onlyFields Validate only these fields
   */
  public validate (additional?: Validator): Validated {
    const validator = new Validator()

    // Make sure all fields are validated
    validator.addField(StandardModuleFieldValidator, ...this.module.fields)

    if (additional) {
      validator.merge(additional)
    }

    return validator.run(this)
  }

  public isValid (additional?: Validator) {
    return this.validate(additional).size === 0
  }
}

export {
  Record
}
