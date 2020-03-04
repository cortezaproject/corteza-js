import { ReportContext, ifExists, arrayify, pixelize } from '../../util'

export function genericStyler (style: any, ctx: ReportContext): any {
  const out: any = {}

  ifExists(style.backgroundColor, out, 'background')

  const margin = arrayify(style.margin)
  if (margin) {
    out.margin = margin.map(v => pixelize(v, ctx))
  }

  return out
}

const decorations: any = {
  underline: 'underline',
  'line-through': 'lineThrough',
  overline: 'overline',
}

export function textStyler (style: any, ctx: ReportContext): any {
  const out: any = {}
  Object.assign(ctx.$style, style)

  ifExists(pixelize(ctx.$style['font-size'], ctx), out, 'fontSize')
  ifExists(pixelize(ctx.$style['line-height'], ctx), out, 'lineHeight')
  ifExists(['bold', 'bolder'].includes(ctx.$style['font-weight']), out, 'bold')
  ifExists(['italic'].includes(ctx.$style['font-style']), out, 'italics')
  ifExists(ctx.$style['text-align'], out, 'alignment')
  ifExists(ctx.$style.color, out, 'color')

  ifExists(decorations[ctx.$style['text-decoration']], out, 'decoration')
  ifExists(ctx.$style['text-decoration-style'], out, 'decorationStyle')
  ifExists(ctx.$style['text-decoration-color'], out, 'decorationColor')
  return out
}
