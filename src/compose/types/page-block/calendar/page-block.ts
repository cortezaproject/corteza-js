import { PageBlock, Registry } from '../base'
import Feed from './feed'

const kind = 'Calendar'

// Map of < V4 view names to >= V4 view names
const legacyViewMapping: {[old: string]: string} = {
  month: 'dayGridMonth',
  agendaMonth: 'dayGridMonth',
  agendaWeek: 'timeGridWeek',
  agendaDay: 'timeGridDay',
  listMonth: 'listMonth',
}

interface Header {
  left: string;
  center: string;
  right: string;
}

interface CalendarOptionsHeader {
  hide: boolean;
  views: string[];
  hidePrevNext: boolean;
  hideToday: boolean;
  hideTitle: boolean;
}

class CalendarOptions {
  public defaultView = ''
  public feeds: Array<Feed> = []
  public header: Partial<CalendarOptionsHeader> = {}
  public locale = 'en-gb'
}

/**
 * Helper class to help define calendar's functionality
 */
export class Calendar extends PageBlock {
  readonly kind = kind
  public options = new CalendarOptions()

  constructor (i?: PageBlock | Partial<PageBlock>) {
    super(i)
    this.applyOptions(i?.options as Partial<CalendarOptions>)
  }

  applyOptions (o?: Partial<CalendarOptions>) {
    if (!o) return

    this.options.defaultView = Calendar.handleLegacyView(o.defaultView) || 'dayGridMonth'
    this.options.feeds = (o.feeds || []).map(f => new Feed(f))
    this.options.header = o.header || {}
    this.options.header = { ...this.options.header, views: Calendar.handleLegacyViews(this.options.header.views || []) }
    this.options.locale = o.locale || 'en-gb'

    // this.options.reminderFeed = reminderFeed
    // this.options.recordFeed = recordFeed
  }

  /**
   * Generates a header object of fullcalendar
   * @returns {Object}
   */
  getHeader (): Header|undefined {
    const h = this.options.header
    if (h.hide) {
      return
    }

    // Show view buttons only when 2 or more are selected
    let right = ''
    if (h.views && h.views.length >= 2) {
      right = this.reorderViews(h.views).join(',')
    }

    return {
      left: `${h.hidePrevNext ? '' : 'prev,next'} ${h.hideToday ? '' : 'today'}`.trim(),
      center: `${h.hideTitle ? '' : 'title'}`,
      right,
    }
  }

  /**
   * Provides a list of available views.
   * @note When adding new ones, make sure included plugins support it.
   * @returns {Array}
   */
  static availableViews () {
    return [
      'dayGridMonth',
      'timeGridWeek',
      'timeGridDay',
      'listMonth',
    ]
  }

  /**
   * Reorder views according to available views array order.
   * @param {Array} views Array of views to filter & sort
   */
  reorderViews (views: string[] = []) {
    return Calendar.availableViews()
      .filter(v => views.find(fv => fv === v))
      .map(v => v)
  }

  /**
   * Converts old < V4 view names to >= V4 view names.
   * @note It wil preserve fields that don't need to/can't be converted
   * @param {Array} views Array of updated view names
   */
  static handleLegacyView (views = 'dayGridMonth'): string {
    return legacyViewMapping[views] || views
  }

  /**
   * Converts old < V4 view names to >= V4 view names.
   * @note It wil preserve fields that don't need to/can't be converted
   * @param {Array} views Array of updated view names
   */
  static handleLegacyViews (views: string[]): string[] {
    return views.map(v => legacyViewMapping[v] || v)
  }
}

Registry.set(kind, Calendar)
