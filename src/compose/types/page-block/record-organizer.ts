import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'
import { Record } from '../record'
import { Compose as ComposeAPI } from '../../../api-clients'
import { Module } from '../module'

const kind = 'RecordOrganizer'
interface Options {
  moduleID: string;
  labelField: string;
  descriptionField: string;
  filter: string;
  positionField: string;
  groupField: string;
  group: string;
}

export class PageBlockRecordOrganizer extends PageBlock {
  readonly kind = kind

  options: Options = {
    moduleID: NoID,
    labelField: '',
    descriptionField: '',
    filter: '',
    positionField: '',
    groupField: '',
    group: '',
  }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')
    Apply(this.options, o, String, 'labelField', 'descriptionField', 'filter', 'positionField', 'groupField', 'group')
  }

  /**
   * Reposition and optionally move record to a different group
   *
   * This is only a helper function and we do not keep any hard dependencies on
   * the API client.
   *
   * @param {Compose}           api Compose API client
   * @param {Record}            record,     Record we're moving
   * @param {Number}            position    New position
   * @param {String|undefined}  group       New group
   * @returns {Promise<void>}
   */
  async moveRecord (api: ComposeAPI, record: Record, position: number, group: string|undefined = undefined): Promise<void> {
    const { namespaceID, moduleID, recordID } = record

    if (moduleID !== this.options.moduleID) {
      throw Error('Record incompatible, module mismatch')
    }

    const { filter, positionField, groupField } = this.options
    const args: {[_: string]: unknown} = {
      recordID,
      filter,
      positionField,
      position,
    }

    if (group !== undefined) {
      // If group is set (empty string is a valid!
      args.groupField = groupField
      args.group = group || ''
    }

    const params = {
      procedure: 'organize',
      namespaceID,
      moduleID,
      // map kv to [{ name: k, value: v }, ...]
      args: Object.keys(args).map(name => ({ name, value: String(args[name]) })),
    }

    return api.recordExec(params)
  }

  /**
   * Fetches group of records using configured options & module
   *
   * @param {Compose}           api Compose API client
   * @param {Module}            module Module to use for assembling API request & casting results
   * @param {String}            filter Filter records
   * @returns {Promise<Record[]>}
   */
  async fetchRecords (api: ComposeAPI, module: Module, filter: string = this.options.filter): Promise<Record[]> {
    if (module.moduleID !== this.options.moduleID) {
      throw Error('Module incompatible, module mismatch')
    }

    const { positionField: sort } = this.options
    const { moduleID, namespaceID } = module

    const params = {
      namespaceID,
      moduleID,
      filter,
      sort,
    }

    return api
      .recordList(params)
      .then(({ set }: { set: object[] }) => set.map(r => Object.freeze(new Record(module, r))))
  }
}

Registry.set(kind, PageBlockRecordOrganizer)
