import { extractID } from './shared'
import { Namespace, Record, Module, Page } from '../../compose'

const success = { variant: 'success', countdown: 5 }
const warning = { variant: 'warning', countdown: 120 }

interface ComposeUIContext {
  $namespace?: Namespace;
  $module?: Module;
  $record?: Record;
  pages: Page[];
  emitter: Function;
  routePusher: Function;
}

/**
 * ComposeUIHelper provides helpers for accessing Compose's UI
 *
 */
export default class ComposeUIHelper {
  readonly $namespace?: Namespace;
  readonly $module?: Module;
  readonly $record?: Record;
  readonly pages?: Page[];
  readonly emitter: Function;
  readonly routePusher: Function;

  /**
   *
   * @param {Namespace} ctx.$namespace - Current namespace
   * @param {Module} ctx.$module - Current module
   * @param {Record} ctx.$record - Current record
   * @param {Page[]} ctx.pages - Array of Page objects
   * @param {Function} ctx.emitter - Event emitter (vm.$emit)
   * @param {Function} ctx.routePusher - Route pusher (vm.$route.push)
   */
  constructor (ctx: ComposeUIContext) {
    this.$namespace = ctx.$namespace
    this.$record = ctx.$record
    this.$module = ctx.$module
    this.pages = ctx.pages
    this.emitter = ctx.emitter
    this.routePusher = ctx.routePusher
  }

  /**
   * Reload current page
   *
   * @example
   * ComposeUI.reload()
   */
  reloadPage (): void {
    this.emitter('reload')
  }

  /**
   * Open record viewer page
   *
   * It searches for page that matches record's module and redirects
   * user to the view mode on that page
   *
   * @example
   * // Edit current record
   * ComposeUI.gotoRecordViewer($record)
   *
   * // Edit current record ($record can be omitted)
   * ComposeUI.gotoRecordViewer()
   *
   * @param {Record} record
   */
  gotoRecordViewer (record = this.$record): void {
    this.gotoRecordPage('page.record', record)
  }

  /**
   * Open record editor page
   *
   * It searches for page that matches record's module and redirects
   * user to the edit mode on that page.
   *
   * @example
   * // Edit current record
   * ComposeUI.gotoRecordEditor($record)
   *
   * // Edit current record ($record can be omitted)
   * ComposeUI.gotoRecordEditor()
   *
   * @param {Record} record
   */
  gotoRecordEditor (record: Record|undefined = this.$record): void {
    this.gotoRecordPage('page.record.edit', record)
  }

  /**
   * Open record page
   *
   * @private
   * @param {string} name
   * @param {Record} record
   * @param {string} record.recordID
   * @param {string} record.moduleID
   */
  gotoRecordPage (name: string, record: Record|undefined = this.$record): void {
    const recordPage = this.getRecordPage(record)
    let pageID, recordID
    if (recordPage) {
      pageID = recordPage.pageID
    }

    if (record) {
      recordID = record.recordID
    }

    if (!pageID) {
      throw Error('record page does not exist')
    }

    if (!recordID) {
      throw Error('invalid record')
    }

    this.goto(name, { pageID, recordID })
  }

  /**
   * Returns record page
   *
   * @private
   * @param {Module|Record} module
   * @param {string} module.moduleID
   * @returns {Page}
   */
  getRecordPage (module: Module|Record|undefined = this.$module): Page|undefined {
    const moduleID = extractID(module, 'moduleID')
    if (this.pages) {
      return this.pages.find(p => p.moduleID === moduleID)
    }
    return undefined
  }

  /**
   * Go to a specific route
   *
   * @private
   * @param {string} name
   * @param {Object} params for $router.push
   */
  goto (name: string, params: object): void {
    this.routePusher({ name, params })
  }

  /**
   * Show a success alert
   *
   * @example
   * ComposeUI.success('Change was successful')
   *
   * @param message
   */
  success (message: string): void {
    this.emitter('alert', { ...success, message })
  }

  /**
   * Show a warning alert
   *
   * @example
   * ComposeUI.warning('Could not save your changes')
   *
   * @param message
   */
  warning (message: string): void {
    this.emitter('alert', { ...warning, message })
  }
}
