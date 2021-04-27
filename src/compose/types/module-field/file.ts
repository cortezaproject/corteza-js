import { ModuleField, Registry } from './base'
import { Apply, ApplyWhitelisted } from '../../../cast'

const kind = 'File'

export const modes = [
  // list of attachments, no preview
  'list',
  // grid of icons
  'grid',
  // single (first) image/file, show preview
  'single',
  // list of all images/files, show preview
  'gallery',
]

interface Options {
  allowImages: boolean;
  allowDocuments: boolean;
  maxSize: number;
  mode: string;
  inline: boolean;
  hideFileName: boolean;
}

const defaults: Readonly<Options> = Object.freeze({
  allowImages: true,
  allowDocuments: true,
  maxSize: 0,
  mode: '\n',
  inline: true,
  hideFileName: false,
})

export class ModuleFieldFile extends ModuleField {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: Partial<ModuleFieldFile>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, Number, 'maxSize')
    Apply(this.options, o, Boolean, 'allowImages', 'allowDocuments', 'inline', 'hideFileName')
    ApplyWhitelisted(this.options, o, modes, 'mode')
  }
}

Registry.set(kind, ModuleFieldFile)
