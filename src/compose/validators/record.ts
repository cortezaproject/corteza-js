import { Validator, ValidatorFn, ValidatorResult, ValidatorError, Validated, IsEmpty } from '../../validator/validator'
import { Record } from '../types/record'
import { Module } from '../types/module'
import { ModuleField } from '../types/module-field'

function genericFieldValidator (field: ModuleField) {
  // newValue is of type unknown to satisfy ValidatorFn interface
  return function (this: Record, newValue: unknown): ValidatorResult {
    if (field.isRequired) {
      if (IsEmpty(newValue as string|string[])) {
        // @todo return something typified...
        return new ValidatorError('missing required value')
      }
    }
  }
}

export class RecordValidator extends Validator<Record> {
  // registered field validators:
  protected rfv: { [field: string]: Validator<Record> }

  /**
   * Construct record validator from module (or record)
   *
   * @param m
   */
  constructor (m: Module|Record) {
    super()

    this.rfv = {}

    if (m instanceof Record) {
      m = m.module
    }

    m.fields.forEach(field => {
      this.rfv[field.name] = new Validator<Record>(genericFieldValidator(field))
    })
  }

  /**
   * Append more record validators
   *
   * @param name
   * @param vfn
   */
  public push (...vfn: ValidatorFn<Record>[]) {
    this.registered.push(...vfn)
  }

  /**
   * Append more field validators
   *
   * @param name
   * @param vfn
   */
  public pushToField (name: string, ...vfn: ValidatorFn<Record>[]) {
    if (!this.rfv[name]) {
      throw new Error('can not push validators to unknown field')
    }

    this.rfv[name].push(...vfn)
  }

  /**
   * Runs validators on record and all (or whitelisted) fields
   *
   * @param r
   */
  public run (r: Record, ...fields: string[]): Validated {
    const out = new Validated()

    if (fields.length === 0) {
      // Fields are not explicitly provided,
      // we can run record-wide validators:
      const result = super.run(r)
      out.push(result)

      // get list of fields from registered field validators
      fields = Object.getOwnPropertyNames(this.rfv)
    }

    for (const field of fields) {
      const results = this.rfv[field].run(r, r.values[field], field)
      results.applyMeta({ field })
      out.push(results)
    }

    return out
  }
}
