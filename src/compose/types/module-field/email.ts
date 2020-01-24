// @todo option to allow multiple entries
// @todo option to allow duplicates
// @todo option to allow only whitelisted domains
import { ModuleField, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'Email'

interface Options {
  outputPlain: boolean;
  multiDelimiter: string;
}

const defaults: Options = {
  outputPlain: true,
  multiDelimiter: '\n',
}

export class ModuleFieldEmail extends ModuleField {
  readonly kind = kind

  options: Options = defaults

  constructor (i?: Partial<ModuleFieldEmail>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'multiDelimiter')
    Apply(this.options, o, Boolean, 'outputPlain')
  }
}

Registry.set(kind, ModuleFieldEmail)
