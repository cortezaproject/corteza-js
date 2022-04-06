import { Capabilities, ModuleField, Registry, Options, defaultOptions } from './base'
import { Apply } from '../../../cast'

const kind = 'Geometry'

interface GeometryOptions extends Options {
  zoomLevel: number;
}

const defaults = (): Readonly<GeometryOptions> => Object.freeze({
  ...defaultOptions(),
  zoomLevel: 3,
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
    
    Apply(this.options, o, Number, 'zoomLevel')
  }

  /**
   * Per module field type capabilities
   */
  public get cap (): Readonly<Capabilities> {
    return {
      ...super.cap,
      multi: true,
    }
  }
}

Registry.set(kind, ModuleFieldGeometry)
