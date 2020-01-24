import { ModuleField, Registry } from './base'

const kind = 'Formula'

interface Options {
  outputPlain: boolean;
  multiDelimiter: string;
}

const defaults: Options = {
  outputPlain: true,
  multiDelimiter: '\n',
}

export class ModuleFieldFormula extends ModuleField {
  readonly kind = kind

  options: Options = defaults

  constructor (i?: Partial<ModuleFieldFormula>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    // if (!o) return

    // options... when we add them.
  }
}

Registry.set(kind, ModuleFieldFormula)
