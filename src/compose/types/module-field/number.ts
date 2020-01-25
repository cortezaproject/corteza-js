import numeral from 'numeral'
import { ModuleField, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'Number'

interface Options {
  format: string;
  prefix: string;
  suffix: string;
  precision: number;
  multiDelimiter: string;
}

const defaults: Readonly<Options> = Object.freeze({
  format: '',
  prefix: '',
  suffix: '',
  precision: 0,
  multiDelimiter: '\n',
})

export class ModuleFieldNumber extends ModuleField {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: Partial<ModuleFieldNumber>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'format', 'prefix', 'suffix', 'multiDelimiter')
    Apply(this.options, o, Number, 'precision')
  }

  formatValue (value: string): string {
    const o = this.options
    let n: number

    switch (typeof value) {
      case 'string':
        n = parseFloat(value)
        break
      case 'number':
        n = value
        break
      default:
        n = 0
    }

    const p = o.precision < 0 || o.precision > 6 ? 0 : o.precision

    let out = n.toFixed(p)

    if (o.format && o.format.length > 0) {
      out = numeral(out).format(o.format)
    }

    return '' + o.prefix + out + o.suffix
  }
}

Registry.set(kind, ModuleFieldNumber)
