import { PageBlock, Registry } from '../base'
import Feed, { FeedInput } from './feed'
import { RecordFeed } from './feed-record'

const kind = 'Geometry'

class GeometryOptions {
    public defaultView = ''
    public center: Array<number> = [30, 30]
    public feeds: Array<Feed> = []
    public zoomStarting = 4
    public zoomMin = 4
    public zoomMax = 4
    public boundTopLeft = ''
    public boundLowerRight = ''
    public lockZoomCenter = false
    public lockBounds = false
}

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
    this.options.center = (o.center || [])
    this.options.boundTopLeft = (o.boundTopLeft || '{"coordinates":[8.8993416,62.578125]}')
    this.options.boundLowerRight = (o.boundLowerRight || '{"coordinates":[24.6651445,33.5742188]}')
    this.options.zoomStarting = (o.zoomStarting || 4)
    this.options.zoomMin = (o.zoomMin || 4)
    this.options.zoomMax = (o.zoomMax || 4)
    this.options.lockZoomCenter = (o.lockZoomCenter || false)
    this.options.lockBounds = (o.lockBounds || false)
  }

  static makeFeed (f?: FeedInput): Feed {
    return new Feed(f)
  }

  static RecordFeed = RecordFeed
}

Registry.set(kind, PageBlockGeometry)
