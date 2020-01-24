// @todo option to allow multiple entries
// @todo option to allow duplicates

import { ModuleField, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'Url'

interface Options {
  trimFragment: boolean;
  trimQuery: boolean;
  trimPath: boolean;
  onlySecure: boolean;
  outputPlain: boolean;
  multiDelimiter: string;
}

const defaults: Options = {
  trimFragment: false,
  trimQuery: false,
  trimPath: false,
  onlySecure: false,
  outputPlain: false,
  multiDelimiter: '\n',
}

export class ModuleFieldUrl extends ModuleField {
  readonly kind = kind

  options: Options = defaults

  constructor (i?: Partial<ModuleFieldUrl>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'multiDelimiter')
    Apply(this.options, o, Boolean, 'trimFragment', 'trimQuery', 'trimPath', 'onlySecure', 'outputPlain')
  }
}

Registry.set(kind, ModuleFieldUrl)
