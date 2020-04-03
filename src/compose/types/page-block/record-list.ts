import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'
import { Compose as ComposeAPI } from '../../../api-clients'
import { Module } from '../module'
import { Button } from './types'

const kind = 'RecordList'
interface Options {
  moduleID: string;
  prefilter: string;
  presort: string;
  fields: unknown[];
  hideHeader: boolean;
  hideAddButton: boolean;
  hideSearch: boolean;
  hidePaging: boolean;
  hideSorting: boolean;
  hideRecordReminderButton: boolean;
  hideRecordCloneButton: boolean;
  hideRecordEditButton: boolean;
  hideRecordViewButton: boolean;
  allowExport: boolean;
  perPage: number;

  // Are table rows selectable
  selectable: boolean;
  selectMode: 'multi' | 'single' | 'range';

  // Ordered list of buttons to display in the block
  selectionButtons: Array<Button>;
}

const defaults: Readonly<Options> = Object.freeze({
  moduleID: NoID,
  prefilter: '',
  presort: '',
  fields: [],
  hideHeader: false,
  hideAddButton: false,
  hideSearch: false,
  hidePaging: false,
  hideSorting: false,
  hideRecordReminderButton: true,
  hideRecordCloneButton: true,
  hideRecordEditButton: false,
  hideRecordViewButton: true,
  allowExport: false,
  perPage: 20,

  selectable: false,
  selectMode: 'multi',

  selectionButtons: [],
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

    Apply(this.options, o, CortezaID, 'moduleID')
    Apply(this.options, o, String, 'prefilter', 'presort', 'selectMode')

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
      'selectable',
      'hideRecordReminderButton',
      'hideRecordCloneButton',
      'hideRecordEditButton',
      'hideRecordViewButton',
    )

    if (o.selectionButtons) {
      this.options.selectionButtons = o.selectionButtons.map(b => new Button(b))
    }
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
