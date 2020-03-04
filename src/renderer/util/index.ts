import { ReportContext } from './nodeParser'

export function ifExists (val: any, obj: any, key: any, check: any = undefined): any {
  if (val !== check) {
    obj[key] = val
  }
}

export function arrayify (val: string): Array<any> | undefined {
  if (!val) {
    return undefined
  }
  let arr = val.split(' ').filter(v => v).map(v => v.trim())

  if (!Array.isArray(arr)) {
    arr = [arr]
  }
  if (arr.length === 1) {
    return new Array(4).fill(arr[0])
  } else if (arr.length === 2) {
    return [arr[1], arr[0], arr[1], arr[0]]
  } else {
    return [arr[1], arr[2], arr[3], arr[0]]
  }
}

export function splitAttr (attr: string): any {
  return attr
    .split(',').map(a => a.trim())
    .map(a => a.split('='))
    .map(([attr, val]) => ({ [attr]: val }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

interface KV {
  [key: string]: string;
}
export function objectify (things: string): KV {
  const rr: KV = {}
  for (const p of things.split(';').map(t => t.trim())) {
    const [k, v] = p.split(':').map(pp => pp.trim())
    rr[k] = v
  }
  return rr
}

export function pixelize (val: string, ctx: ReportContext): number | undefined {
  if (!val) {
    return undefined
  }

  const stdErr = () => { throw new Error('style.invalidDimension') }
  const e = (/([0-9.]+)(\w+)?/gi).exec(val)
  if (!e) {
    stdErr()
  }
  const [, v, u]: any = e

  if (!u) {
    return parseFloat(v)
  }
  switch (u) {
    case 'px':
      return parseFloat(v)
    case 'em':
      const ww = ctx.$style.$pxSize * parseFloat(v)
      return ww

    default:
      throw new Error('style.unsupportedFormat')
  }
}

export function tagStyle (name: string | undefined): KV {
  if (!name) {
    return {}
  }
  switch (name) {
    case 'b':
    case 'strong':
      return { 'font-weight': 'bold' }

    case 'i':
    case 'em':
      return { 'font-style': 'italic' }

    case 'del':
      return { 'text-decoration': 'line-through' }

    case 'ins':
    case 'a':
      return { 'text-decoration': 'underline' }
  }
  return {}
}

export * from './nodeParser'
