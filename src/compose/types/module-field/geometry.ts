import { Capabilities, ModuleField, Registry, Options, defaultOptions } from './base'
import { Apply } from '../../../cast'

const kind = 'Geometry'

interface GeometryOptions extends Options {
}

const defaults = (): Readonly<GeometryOptions> => Object.freeze({
  ...defaultOptions(),
})

export class ModuleFieldGeometry extends ModuleField {
  readonly kind = kind

  options: GeometryOptions = { ...defaults() }

  constructor (i?: Partial<ModuleFieldGeometry>) {
    super(i)
    this.applyOptions(i?.options)
  }

  applyOptions (o?: Partial<GeometryOptions>): void {
    if (!o) return
    super.applyOptions(o)

  }

  /**
   * Per module field type capabilities
   */
  public get cap (): Readonly<Capabilities> {
    return {
      ...super.cap,
      multi: false,
    }
  }
}

Registry.set(kind, ModuleFieldGeometry)
