import { feedResources } from './resources'
import { Apply, NoID } from '../../../../cast'
import { IsOf } from '../../../../guards'

interface FeedOptions {
  color: string;
  prefilter: string;
  moduleID: string;
  resource: string;
  titleField: string;
  geometryField: string;
}

export type FeedInput = Partial<Feed> | Feed

const defOptions = {
  moduleID: NoID,
  color: '',
  prefilter: '',
  resource: 'compose:record',
  titleField: '',
  geometryField: '',
}

/**
 * Feed class represents an event feed for the given calendar
 */
export default class Feed {
  public resource = 'compose:record'
  public titleField = ''
  public color = ''
  public geometryField = ''
  public options: FeedOptions = { ...defOptions }

  constructor (i?: FeedInput) {
    this.apply(i)
  }

  apply (i?: FeedInput): void {
    if (!i) return

    if (IsOf<Feed>(i, 'resource')) {
      Apply(this, i, String, 'resource', 'color', 'titleField', 'geometryField')

      if (i.options) {
        this.options = { ...this.options, ...i.options }
      }
    }
  }
}
