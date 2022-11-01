import { PageBlock, Registry } from '../base'
import Feed, { FeedInput } from './feed'
import { RecordFeed } from './feed-record'

const kind = 'Geometry'

// interface Feed {
//   color: string;
//   prefilter: string;
//   moduleID: string;
//   resource: string;
//   titleField: string;
// }

class GeometryOptions {
    public defaultView = ''
    public center = ''
    public feeds: Array<Feed> = []
    public zoom = 4
    public boundsUpper = ''
    public boundsLower = ''
}

/**
 * Helper class to help define calendar's functionality
 */
export class PageBlockGeometry extends PageBlock {
  readonly kind = kind
  public options = new GeometryOptions()

  static feedResources = Object.freeze({
    record: 'compose:record',
  })

  constructor (i?: PageBlock | Partial<PageBlock>) {
    super(i)
    this.applyOptions(i?.options as Partial<GeometryOptions>)
  }

  applyOptions (o?: Partial<GeometryOptions>): void {
    if (!o) return

    this.options.feeds = (o.feeds || [])
    this.options.center = (o.center || '{"coordinates":[30, 30]}')
    this.options.boundsUpper = (o.boundsUpper || '{"coordinates":[8.8993416,62.578125]}')
    this.options.boundsLower = (o.boundsLower || '{"coordinates":[24.6651445,33.5742188]}')
    this.options.zoom = (o.zoom || 4)
  }

  static makeFeed (f?: FeedInput): Feed {
    return new Feed(f)
  }

  static RecordFeed = RecordFeed
}

Registry.set(kind, PageBlockGeometry)
