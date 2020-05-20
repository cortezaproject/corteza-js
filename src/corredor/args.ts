import { CortezaTypes } from './args-corteza'
import { Caster } from './shared'

/**
 * Handles arguments, passed to the script
 *
 * By convention variables holding "current" resources are prefixed with dollar ($) sign.
 * For example, before/after triggers for record will call registered scripts with $record, $module
 * and $namespace, holding current record, it's module and namespace.
 *
 * All these variables are casted (if passed as an argument) to proper types ($record => Record, $module => Module, ...)
 */
export class Args {
  private cachedArgs: { [_: string]: any };

  constructor (args: {[_: string]: unknown}, caster: Caster = CortezaTypes) {
    this.cachedArgs = {}

    for (const arg in args) {
      if (caster && caster.has(arg)) {
        const cast = caster.get(arg)

        if (cast) {
          Object.defineProperty(this, `$${arg}`, {
            get: () => {
              if (!this.cachedArgs[arg]) {
                this.cachedArgs[arg] = cast.call(this, args[arg])
              }

              return this.cachedArgs[arg]
            },
            configurable: false,
            enumerable: true,
          })
        }

        Object.defineProperty(this, `raw${arg.substring(0, 1).toUpperCase()}${arg.substring(1)}`, {
          value: args[arg],
          writable: false,
          configurable: false,
          enumerable: true,
        })
      } else {
        Object.defineProperty(this, arg, {
          value: args[arg],
          writable: false,
          configurable: false,
          enumerable: true,
        })
      }
    }
  }
}
