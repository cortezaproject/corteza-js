import { PageBlock, PageBlockInput, Registry } from './base'
import { Apply } from '../../../cast'
import { Compose as ComposeAPI } from '../../../api-clients'
import { Record } from '../record'
import { convertRevisionPayloadToRevision, RawRevisionPayload, Revision } from '../revision'

const kind = 'RecordRevisions'
interface Options {
  preload: boolean;
}

const defaults: Readonly<Options> = Object.freeze({
  preload: false,
})

export class PageBlockRecordRevisions extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    Apply(this.options, o, Boolean, 'preload')
  }

  async fetch (api: ComposeAPI, record: Record): Promise<Array<Revision>> {
    const { namespaceID, moduleID, recordID } = record

    return api
      .recordRevisions({ namespaceID, moduleID, recordID })
      .then(payload => convertRevisionPayloadToRevision((payload as unknown) as RawRevisionPayload))
  }
}

Registry.set(kind, PageBlockRecordRevisions)
