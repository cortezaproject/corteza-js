import { reminderFeed, recordFeed } from './feedLoader'
import Feed from './feed'
import { PageBlock, Registry } from '../base'

const kind = 'Calendar'

// Map of < V4 view names to >= V4 view names
const legacyViewMapping = {
  month: 'dayGridMonth',
  agendaMonth: 'dayGridMonth',
  agendaWeek: 'timeGridWeek',
  agendaDay: 'timeGridDay',
  listMonth: 'listMonth',
}

/**
 * Helper class to help define calendar's functionality
 */
export class Calendar extends PageBlock {
  constructor (i = {}) {
    super(i)
    this.kind = kind
    this.options = {
      defaultView: '',
      feeds: [],
      header: {},
      locale: '',
    }
  }

  applyOptions (o = {}) {
    this.options.defaultView = Calendar.handleLegacyViews(o.defaultView) || 'dayGridMonth'
    this.options.feeds = (o.feeds || []).map(f => new Feed(f))
    this.options.header = o.header || {}
    this.options.header = { ...this.options.header, views: Calendar.handleLegacyViews(this.options.header.views || []) }
    this.options.locale = o.locale || 'en-gb'

    this.options.reminderFeed = reminderFeed
    this.options.recordFeed = recordFeed
  }

  /**
   * Generates a header object of fullcalendar
   * @returns {Object}
   */
  getHeader () {
    const h = this.header
    if (h.hide) {
      return false
    }

    // Show view buttons only when 2 or more are selected
    let right = false
    if (h.views.length >= 2) {
      right = this.reorderViews(h.views).join(',')
    }

    const header = {
      left: `${h.hidePrevNext ? '' : 'prev,next'} ${h.hideToday ? '' : 'today'}`.trim(),
      center: `${h.hideTitle ? '' : 'title'}`,
      right,
    }

    return header
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
  reorderViews (views = []) {
    return Calendar.availableViews()
      .filter(v => views.find(fv => fv === v))
      .map(v => v)
  }

  /**
   * Converts old < V4 view names to >= V4 view names.
   * @note It wil preserve fields that don't need to/can't be converted
   * @param {Array} views Array of updated view names
   */
  static handleLegacyViews (views) {
    if (!Array.isArray(views)) {
      return legacyViewMapping[views] || views
    }
    return views.map(v => legacyViewMapping[v] || v)
  }
}

Registry.set(kind, Calendar)
