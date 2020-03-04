import { Node } from '..'
import hb from 'handlebars'
const vm = require('vm')

hb.registerHelper('property', function (obj, prop) {
  return obj['Gender']
})

export interface ReportContext { [key: string]: any }
export type ParseNodeFunction = (node: Node, ctx: ReportContext) => ParsedNode
type ContentParserFunction = (node: Node, ctx: ReportContext, parseNode: ParseNodeFunction) => ParsedNode
export interface ContentParser {
  tag: string | Array<string>;
  parser: ContentParserFunction;
}

export interface Render {
  meta: { [key: string]: any };
  report: Buffer;
  type: string;
  ext: string;
}

type ParsedNode = any

// these attrs should not be interpolated
const reservedAttrs = [
  'data-for',
  'data-if',
  'class',
]

export class NodeParser {
  private contentParsers: { [key: string]: ContentParserFunction } = {}
  private fallbackParser? : ContentParserFunction

  constructor (parsers: Array<ContentParser>, fallback? : ContentParserFunction) {
    for (const p of parsers) {
      if (Array.isArray(p.tag)) {
        p.tag.forEach(t => {
          this.contentParsers[t] = p.parser
        })
      } else {
        this.contentParsers[p.tag] = p.parser
      }
    }

    this.fallbackParser = fallback
  }

  public parseNode (node: Node, ctx: ReportContext): ParsedNode {
    if (!node) {
      return undefined
    }
    // conditional rendering
    if (node.attrs) {
      // interpolate attrs
      for (const att in node.attrs) {
        if (!reservedAttrs.includes(att)) {
          node.attrs[att] = hb.compile(node.attrs[att])(ctx)
        }
      }

      // @todo add support for else-if and else statements
      if (node.attrs['data-if']) {
        if (!this.parseStatement(node.attrs['data-if'], ctx)) {
          return undefined
        }
      }
    }

    // repeated rendering
    if (node.attrs && node.attrs['data-for']) {
      return this.buildIterator(node.attrs['data-for'], ctx).map((i: any) => {
        const lCtx: ReportContext = { ...ctx, ...i }
        return this.parseNodeContent(node, lCtx)
      })
    }

    // regular rendering
    return this.parseNodeContent(node, ctx)
  }

  private parseNodeContent (node: Node, ctx: ReportContext): ParsedNode {
    if (node.type === 'text') {
      return this.parseLeaf(node, ctx)
    }

    if (!node.name) {
      throw new Error('node.invalidName')
    }

    const parser = this.contentParsers[node.name] || this.fallbackParser
    if (!parser) {
      throw new Error(`node.parserNotDefined.${node.name}`)
    }

    return parser(node, ctx, this.parseNode.bind(this))
  }

  private parseLeaf (node: Node, ctx: ReportContext): ParsedNode {
    if (!node.content) {
      return ''
    }
    return hb.compile(node.content)(ctx)
  }

  private parseStatement (statement: string, ctx: ReportContext): any {
    ctx = JSON.parse(JSON.stringify(ctx))
    vm.createContext(ctx)
    return vm.runInContext(statement, ctx)
  }

  private buildIterator (statement: string, ctx: ReportContext): any {
    const [, row, index, op, source]: any = /\((\w+)\s*,\s*(\w+)\)\s*(\w+)\s+(.+)/.exec(statement)
    const values = this.parseStatement(source, ctx)
    return values.map((value: any, i: any) => ({ [row]: value, [index]: i }))
  }
}
