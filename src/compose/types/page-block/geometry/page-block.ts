import { PageBlock, Registry } from '../base'
import Feed, { FeedInput } from './feed'
import { RecordFeed } from './feed-record'

const kind = 'Geometry'

class GeometryOptions {
    public defaultView = ''
    public center: Array<number> = [30, 30]
    public feeds: Array<Feed> = []
    public zoomStarting = 3
    public zoomMin = 1
    public zoomMax = 18
    public bounds: Array<number> | null = []
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
    this.options.zoomStarting = (o.zoomStarting || 3)
    this.options.zoomMin = (o.zoomMin || 1)
    this.options.zoomMax = (o.zoomMax || 18)
    this.options.bounds = (o.bounds || null)
    this.options.lockBounds = (o.lockBounds || false)
  }

  static makeFeed (f?: FeedInput): Feed {
    return new Feed(f)
  }

  static RecordFeed = RecordFeed
}

Registry.set(kind, PageBlockGeometry)
