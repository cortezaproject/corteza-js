import { Node } from '../..'
import { ReportContext, splitAttr, ContentParser, ParseNodeFunction, objectify, tagStyle } from '../../util'
import { genericStyler, textStyler } from './stylers'

const parsers: Array<ContentParser> = [
  {
    tag: [
      'p',
      'span',
      'b',
      'strong',
      'i',
      'em',
      'del',
      'ins',
      'a',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'small',
      'big',
    ],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      ctx = JSON.parse(JSON.stringify({ ...ctx }))
      const style = { ...tagStyle(node.name), ...objectify(node.attrs?.style || '') }

      // @todo adjust dd based on node name; eg. add link for <a>
      const dd: any = {
        ...genericStyler(style, ctx),
        ...textStyler(style, ctx),
        text: [],
      }

      if (node.name === 'a') {
        // if (!node.attrs?.href) {
        //   throw new Error('node.invalidAttrs')
        // }
        dd.link = node.attrs?.href
      }

      for (const c of node.children || []) {
        const cc = parseNode(c, ctx)
        if (c.attrs && c.attrs['data-for']) {
          dd.text.push({ text: cc })
        } else {
          dd.text.push(cc)
        }
      }
      if (dd.text.length === 1) {
        dd.text = dd.text[0]
      }

      return dd
    },
  },
  {
    tag: ['head'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const dd: any = {
        info: {},
        document: {},
      }

      for (const c of node.children || []) {
        const cc = parseNode(c, ctx)
        if (!cc) {
          continue
        }
        const k = Object.keys(cc)[0]
        Object.assign(dd[k], cc[k])
      }

      return dd
    },
  },
  {
    tag: ['meta'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      if (!node.attrs) {
        return undefined
      }

      if (node.attrs && node.attrs.name) {
        ctx.$meta[node.attrs.name] = node.attrs.content
      }

      let params: any
      switch (node.attrs.name) {
        case 'description':
          return {
            info: { subject: node.attrs.content },
          }

        case 'keywords':
          return {
            info: { keywords: node.attrs.content },
          }

        case 'author':
          return {
            info: { author: node.attrs.content },
          }

        case 'viewport':
          params = splitAttr(node.attrs.content)
          return {
            document: {
              pageSize: {
                width: parseFloat(params.width),
                height: parseFloat(params.height),
              },
            },
          }

        case 'margin':
          params = splitAttr(node.attrs.content)
          return {
            document: {
              pageMargins: [
                parseFloat(params.left),
                parseFloat(params.top),
                parseFloat(params.right),
                parseFloat(params.bottom),
              ],
            },
          }
      }

      return undefined
    },
  },
  {
    tag: ['title'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const nn = (node.children || [])[0]

      if (!ctx.$meta) {
        ctx.$meta = {}
      }
      ctx.$meta.title = parseNode(nn, ctx)

      return {
        info: {
          title: (nn || {}).content,
        },
      }
    },
  },
  {
    tag: ['div', 'header', 'footer', 'main'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const content: any = []

      for (const c of node.children || []) {
        const cc = parseNode(c, ctx)
        if (c.attrs && c.attrs['data-for']) {
          content.push(...cc)
        } else {
          content.push(cc)
        }
      }

      return {
        layout: 'noBorders',
        table: {
          headerRows: 0,
          widths: ['*'],
          body: [
            [[content]],
          ],
        },
      }
    },
  },
  {
    tag: ['br'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      return {
        text: '',
        pageBreak: 'before',
      }
    },
  },
  {
    tag: ['table'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const dd: any = {
        layout: 'headerLineOnly',
        table: {
          body: [],
        },
      }

      // header
      const th = node.children?.find(({ name }) => name === 'thead')
      if (th) {
        for (const c of th.children || []) {
          const cc = parseNode(c, ctx)
          if (c.attrs && c.attrs['data-for']) {
            dd.table.body.push(...cc)
          } else {
            dd.table.body.push(cc)
          }
        }
        dd.table.headerRows = dd.table.body.length
      }

      // body
      const rows = (node.children?.find(({ name }) => name === 'tbody')?.children) ||
        node.children || []

      for (const c of rows) {
        const cc = parseNode(c, ctx)
        if (c.attrs && c.attrs['data-for']) {
          dd.table.body.push(...cc)
        } else {
          dd.table.body.push(cc)
        }
      }

      // @todo column widths
      dd.table.widths = dd.table.body[0].map(() => '*')

      return dd
    },
  },
  {
    tag: ['tr'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const dd: any = []

      for (const c of node.children || []) {
        const cc = parseNode(c, ctx)
        if (c.attrs && c.attrs['data-for']) {
          dd.push(...cc)
        } else {
          dd.push(cc)
        }
      }
      return dd
    },
  },
  {
    tag: ['td', 'th'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      return parseNode((node.children || [])[0], ctx)
    },
  },
  {
    tag: ['ol', 'ul'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      if (!node.name) {
        throw new Error('node.invalid')
      }

      const dd: any = {
        [node.name]: [],
      }

      for (const c of node.children || []) {
        const cc = parseNode(c, ctx)
        if (c.attrs && c.attrs['data-for']) {
          dd[node.name].push(...cc)
        } else {
          dd[node.name].push(cc)
        }
      }

      return dd
    },
  },
  {
    tag: ['li'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      return parseNode((node.children || [])[0], ctx)
    },
  },
  {
    tag: ['img'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      if (!node.attrs || !node.attrs.src) {
        throw new Error('node.invalidAttrs')
      }

      return {
        image: node.attrs.src,
      }
    },
  },
  {
    tag: ['template'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const rr = node.children?.map(n => parseNode(n, ctx)).filter(r => r)[0]
      return rr
    },
  },
]

function fallbackParser (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any {
  return node.children?.map(n => parseNode(n, ctx))
}

export { parsers, fallbackParser }
