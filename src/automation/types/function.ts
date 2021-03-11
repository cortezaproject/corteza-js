import { Apply } from '../../cast'
import { Param } from "./param";

export interface FunctionMeta {
  short: string
  description: string
  visual: { [_: string]: any }
}

export class Function {
  public ref = ''
  public kind = ''
  public meta: Partial<FunctionMeta> = {}
  public parameters: Array<Param> = []
  public results: Array<Param> = []
  public labels: { [_: string]: string } = {}

  constructor (u?: Partial<Function>) {
    this.apply(u)
  }

  apply (u?: Partial<Function>): void {
    Apply(this, u, String, 'ref', 'kind')

    if (u?.parameters) {
      this.parameters = u.parameters
    }

    if (u?.results) {
      this.results = u.results
    }

    if (u?.meta) {
      this.meta = { ...u.meta }
    }
  }
}
