import { renderPDF, renderHTML } from './engines'
import defaultStyle from './assets/defaultStyle'
import { Render } from './util'

const hps = require('html-parse-stringify')
const ics = require('inline-css')

export enum RendererKind {
  PDF,
  HTML,
}

export interface Document {
  template: string;
  data: { [key: string]: any };
  renderer: RendererKind;
  fontFace?: { [key: string]: any };
}

export interface Node {
  type: string;
  name?: string;
  voidElement?: boolean;
  attrs?: { [key: string]: any };
  children?: Array<Node>;
  content?: string;
}

/**
 * render function renders the provided report object.
 * @param document The report we want to render
 */
export async function render (document: Document): Promise<Render> {
  // inline styles for easier processing
  let template = `<style>${defaultStyle}</style>${document.template}`
  template = await ics(template, {
    url: ' ',
    applyWidthAttributes: true,
    applyTableAttributes: true,
    removeHtmlSelectors: true,
  })

  // minify template to remove unneeded components such as whitespace, comments, ...
  const hm = require('html-minifier')
  template = hm.minify(template, {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
  })

  // parse template to an ast tree
  const tree = hps.parse(template) as Array<Node>

  // render the report
  switch (document.renderer) {
    case RendererKind.PDF:
      return renderPDF(tree, document)

    case RendererKind.HTML:
      return renderHTML(tree, document)

    default:
      throw new Error('renderer.notSupported')
  }
}
