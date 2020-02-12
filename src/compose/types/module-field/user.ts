// @todo option to allow multiple entries
// @todo option to allow duplicates
import { ModuleField, Registry } from './base'
import { Apply } from '../../../cast'
import { User } from '../../../system'

const kind = 'User'

interface Options {
  presetWithAuthenticated: boolean;
  selectType: string;
  multiDelimiter: string;
}

const defaults: Readonly<Options> = Object.freeze({
  presetWithAuthenticated: false,
  selectType: 'default',
  multiDelimiter: '\n',
})

export class ModuleFieldUser extends ModuleField {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: Partial<ModuleFieldUser>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, Boolean, 'presetWithAuthenticated')
    Apply(this.options, o, String, 'selectType', 'multiDelimiter')
  }

  formatter ({ userID, name, username, email }: Partial<User> = {}): string {
    return name || username || email || userID || ''
  }
}

Registry.set(kind, ModuleFieldUser)
