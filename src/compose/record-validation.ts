import { Record, Values } from './types/record'
import { ModuleField } from './types/module-field'
import { AreObjectsOf } from '../guards'

export const ValidatedRecordKey = null

export class ValidatorWarning {
  /**
   * Simple warning/error message
   */
  readonly message: string

  /**
   * Key used for translation
   */
  readonly key?: string

  /**
   * Any additional keys that can be used to expand (translated) message
   */
  readonly meta: { [_: string]: string } = {}

  constructor (message: string, key?: string, meta: { [_: string]: string } = {}) {
    this.message = message
    this.key = key
    this.meta = meta
  }
}

export class ValidatorError extends ValidatorWarning {}
const ValidatorFalseDefaultError = new ValidatorError('invalid value', 'invalidValue')

/**
 * Holds field (key=field name) & record (key=null) validation results
 * If field/record(null) does not exists, there's no error for the field or record
 * If Map is empty (size=0) there are no errors
 */
export type Validated = Map<string|null, ValidatorWarning[]>

export type ValidatorResult = Validated | ValidatorWarning[] | ValidatorWarning | boolean

export interface FieldValidator {
  (this: ModuleField, newValue: string | string[], record?: Record): ValidatorResult;
}

export interface RecordValidator {
  (this: Record, values: Values): ValidatorResult;
}

export function IsEmpty (v: undefined|string|string[]): boolean {
  if (!v || v.length === 0) {
    return true
  }

  if (Array.isArray(v)) {
    return v.every(i => !i)
  }

  return !v
}

/**
 * Checks if values are equal
 * @param {string|string[]} v1 Value in question
 * @param {string|string[]} v2 Value to compare to
 * @returns {boolean}
 */
export function AreEqual (v1: string|string[], v2: string|string[]): boolean {
  if (Array.isArray(v1)) {
    if (!Array.isArray(v2) || v1.length !== v2.length) {
      return false
    }

    return !!v1.find((v, i) => v !== v2[i])
  } else {
    return v1 === v2
  }
}

/**
 * Standard field validator
 */
export function StandardModuleFieldValidator (this: ModuleField, newValue: string | string[]): Validated {
  if (this.isRequired) {
    if (IsEmpty(newValue)) {
      // @todo return something typified...
      return new Map([[this.name, [new ValidatorError('missing required value')]]])
    }
  }

  // @todo plug-in into validators of different types
  return new Map()
}

export function MergeValidated (map: Validated, key: string|null, ...r: ValidatorResult[]): Validated {
  let out: Validated = new Map([...map])
  r.forEach(r => {
    const curr = out.get(key) || []
    switch (true) {
      case typeof r === 'boolean':
        if (!r) {
          out.set(key, [...curr, ValidatorFalseDefaultError])
        }
        break

      case r instanceof ValidatorWarning:
        out.set(key, [...curr, r as ValidatorWarning])
        break

      case Array.isArray(r):
        out.set(key, [...curr, ...(r as ValidatorWarning[])])
        break

      case r instanceof Map:
        out = new Map([...out, ...(r as Validated)])
        break
    }
  })

  return out
}

export class Validator {
  /**
   * Field-value validators
   */
  private fields: Map<string, FieldValidator[]> = new Map()

  /**
   * Record-wide validators
   */
  private record: RecordValidator[] = []

  constructor (map?: Map<string, FieldValidator[]>) {
    if (map) {
      this.fields = map
    }
  }

  public merge (validator: Validator): void {
    // Merge all field validators
    for (const field in validator.fields.keys()) {
      this.fields.set(field, [...(this.fields.get(field) || []), ...(validator.fields.get(field) || [])])
    }

    // Merge record validators
    this.addRecord(validator.record)
  }

  public addRecord (v: RecordValidator|RecordValidator[]): void {
    if (Array.isArray(v)) {
      this.record.push(...v)
    } else {
      this.record.push(v)
    }
  }

  /**
   * Merges list of validators
   *
   * It can:
   *  - merge 2 Validator objects
   *  - append one or more validator functions to one or more fields
   *
   * @param validator
   * @param {...(string|ModuleField)[]} fields list of fields to use (for filtering)
   */
  public addField (validator: (FieldValidator|FieldValidator[]), ...fields: (string | ModuleField)[]): void {
    if (fields.length === 0) {
      // Fields not explicitly set, assume all
      fields = [...this.fields.keys()]
    }

    if (AreObjectsOf<ModuleField>(fields, 'name')) {
      fields = fields.map(({ name }) => name)
    }

    (fields as string[]).forEach((field) => {
      // Merge with existing
      this.fields.set(field, [...(this.fields.get(field) || []), ...(Array.isArray(validator) ? validator : [validator])])
    })
  }

  public runRecordValidators (record: Record): Validated {
    let result: Validated = new Map()

    this.record.forEach(validator => {
      result = MergeValidated(result, ValidatedRecordKey, validator.call(record, record.values))
    })

    return result
  }

  public runFieldValidators (record: Record): Validated {
    let result: Validated = new Map()

    this.fields.forEach((validators, name) => {
      validators.forEach(validator => {
        const field = record.module.findField(name)
        if (field) {
          result = MergeValidated(result, name, validator.call(field, record.values[name], record))
        }
      })
    })

    return result
  }

  public run (record: Record): Validated {
    return new Map([
      ...this.runRecordValidators(record),
      ...this.runFieldValidators(record),
    ])
  }
}
