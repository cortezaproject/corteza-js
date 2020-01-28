import { Capabilities, ModuleField, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'Formula'

interface Options {
  multiDelimiter: string;
}

const defaults: Readonly<Options> = Object.freeze({
  multiDelimiter: '\n',
})

export class ModuleFieldFormula extends ModuleField {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: Partial<ModuleFieldFormula>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    // if (!o) return

    Apply(this.options, o, String, 'multiDelimiter')
  }

  /**
   * Per module field type capabilities
   */
  public get cap (): Readonly<Capabilities> {
    return {
      ...super.cap,
      required: false,
      private: false,
    }
  }
}

Registry.set(kind, ModuleFieldFormula)
