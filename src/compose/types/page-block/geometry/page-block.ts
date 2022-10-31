import { PageBlock, Registry } from '../base'
import { RecordFeed } from './feed-record'

interface Feed {
  color: string;
  prefilter: string;
  moduleID: string;
  resource: string;
  titleField: string;
}

const kind = 'Geometry'

class GeometryOptions {
    public defaultView = ''
    public feeds: Array<Feed> = []
    public zoom = ''
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
  }

  //   static makeFeed (f?: FeedInput): Feed {
  //     return new Feed(f)
  //   }

  static RecordFeed = RecordFeed
}

Registry.set(kind, PageBlockGeometry)
