import { Node } from '../..'
import { ReportContext, ParseNodeFunction, ContentParser } from '../../util'

const parsers: Array<ContentParser> = [
  {
    tag: ['meta'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      if (node.attrs && node.attrs.name) {
        ctx.$meta[node.attrs.name] = node.attrs.content
      }

      return fallbackParser(node, ctx, parseNode)
    },
  },
  {
    tag: ['title'],
    parser: (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any => {
      const nn = (node.children || [])[0]
      if (!nn) {
        return
      }
      ctx.$meta.title = parseNode(nn, ctx)

      return fallbackParser(node, ctx, parseNode)
    },
  },
]

function fallbackParser (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction): any {
  const cc = JSON.parse(JSON.stringify(node)) as Node
  if (cc.children) {
    cc.children = []
  }

  for (const n of node.children || []) {
    let content = parseNode(n, ctx)

    // take core for a correct text node format
    if (n.type === 'text') {
      content = {
        type: 'text',
        content,
      }
    }

    if (n.attrs && n.attrs['data-for']) {
      cc.children?.push(...content)
    } else {
      cc.children?.push(content)
    }
  }

  return cc
}

export { fallbackParser, parsers }
