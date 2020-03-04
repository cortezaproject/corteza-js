import { Document, Node } from '../../'
import { NodeParser, ReportContext, Render } from '../../util'
import { parsers, fallbackParser } from './parsers'
const PdfMake = require('pdfmake')

export default async function (tree: Array<Node>, report: Document): Promise<Render> {
  if (!report.fontFace) {
    throw new Error('document.font.undefined')
  }

  const dd: any = {}
  const printer = new PdfMake(report.fontFace)
  const np = new NodeParser(parsers, fallbackParser)
  const ctx: ReportContext = {
    ...report.data,
    $style: {
      // default pixel size for em conversions
      $pxSize: 16,
    },
    $meta: {},
  }

  // document root
  tree = (tree
    .find(({ name }) => name === 'DOCTYPE')?.children || tree)
    .find(({ name }) => name === 'html')?.children || tree

  // determine meta
  const hh = tree.find(({ name }) => name === 'head')
  if (hh) {
    const { info, document } = np.parseNode(tree[0], ctx)
    dd.pageSize = document.pageSize
    dd.pageMargins = document.pageMargins
    dd.info = info
    ctx.$style.$document = document
  }

  // determine content
  tree = tree.find(({ name }) => name === 'body')?.children || tree
  // running elements
  const headers = tree.filter(({ name }) => name === 'header')
  const footers = tree.filter(({ name }) => name === 'footer')
  const buildRunning = (rn: Array<Node>, ctx: ReportContext) => (currentPage: number, pageCount: number, pageSize: number): any => {
    const rCtx: ReportContext = { ...ctx, $page: { currentPage, pageCount, pageSize } }

    let r: Node | undefined
    for (const node of rn) {
      r = np.parseNode(node, rCtx)
      if (r) {
        break
      }
    }
    if (!r) {
      return {}
    }

    return r
  }

  dd.header = buildRunning(headers, report.data)
  dd.footer = buildRunning(footers, report.data)

  // content
  const mn = tree.find(({ name }) => name === 'main')
  tree = mn ? [mn] : tree.filter(({ name }) => name !== 'header' && name !== 'footer')
  dd.content = tree.map(node => np.parseNode(node, ctx))
  const doc = printer.createPdfKitDocument(dd, {})

  // create a data buffer for response
  const chunks: any = []
  return new Promise((resolve, reject) => {
    doc.on('data', function (chunk: any) {
      chunks.push(chunk)
    })
    doc.on('end', function () {
      resolve({
        meta: ctx.$meta,
        report: Buffer.concat(chunks),
        type: 'application/pdf',
        ext: '.pdf',
      })
    })
    doc.on('error', (...e: any) => {
      reject(e)
    })

    doc.end()
  })
}
