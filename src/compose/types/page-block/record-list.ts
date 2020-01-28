import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'
import { Compose as ComposeAPI } from '../../../api-clients'
import { Module } from '../module'

const kind = 'RecordList'
interface Options {
  pageID: string;
  moduleID: string;
  prefilter: string;
  presort: string;
  fields: unknown[];
  hideHeader: boolean;
  hideAddButton: boolean;
  hideSearch: boolean;
  hidePaging: boolean;
  hideSorting: boolean;
  allowExport: boolean;
  perPage: number;
}

const defaults: Readonly<Options> = Object.freeze({
  pageID: NoID,
  moduleID: NoID,
  prefilter: '',
  presort: '',
  fields: [],
  hideHeader: false,
  hideAddButton: false,
  hideSearch: false,
  hidePaging: false,
  hideSorting: false,
  allowExport: false,
  perPage: 20,
})

export class PageBlockRecordList extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'pageID', 'moduleID')
    Apply(this.options, o, String, 'prefilter', 'presort')

    if (o.fields) {
      this.options.fields = o.fields
    }

    Apply(this.options, o, Boolean,
      'hideHeader',
      'hideAddButton',
      'hideSearch',
      'hidePaging',
      'hideSorting',
      'allowExport',
    )
  }

  async fetch (api: ComposeAPI, recordListModule: Module, filter: {[_: string]: unknown}): Promise<object> {
    if (recordListModule.moduleID !== this.options.moduleID) {
      throw Error('Module incompatible, module mismatch')
    }

    filter.moduleID = this.options.moduleID
    filter.namespaceID = recordListModule.namespaceID

    return api
      .recordList(filter)
      .then(r => {
        const { set: records, filter } = r as { filter: object; set: object[] }
        return { records, filter }
      })
  }
}

Registry.set(kind, PageBlockRecordList)
