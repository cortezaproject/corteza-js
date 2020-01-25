import { ModuleField, Registry } from './base'
import { Apply } from '../../../cast'

const kind = 'String'

interface Options {
  multiLine: boolean;
  useRichTextEditor: boolean;
  multiDelimiter: string;
}

const defaults: Readonly<Options> = Object.freeze({
  multiLine: false,
  useRichTextEditor: false,
  multiDelimiter: '\n',
})

export class ModuleFieldString extends ModuleField {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: Partial<ModuleFieldString>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, String, 'multiDelimiter')
    Apply(this.options, o, Boolean, 'multiLine', 'useRichTextEditor')
  }
}

Registry.set(kind, ModuleFieldString)
