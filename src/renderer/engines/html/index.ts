import { Document, Node } from '../../'
import { NodeParser, ReportContext, Render } from '../../util'
import { fallbackParser, parsers } from './parsers'
const hps = require('html-parse-stringify')

export default async function (tree: Array<Node>, report: Document): Promise<Render> {
  const np = new NodeParser(parsers, fallbackParser)
  const ctx: ReportContext = {
    ...report.data,
    $meta: {},
    $style: {},
  }

  const nt = tree.map(n => np.parseNode(n, ctx))

  return {
    meta: ctx.$meta,
    report: Buffer.from(hps.stringify(nt)),
    type: 'text/html',
    ext: '.html',
  }
}
