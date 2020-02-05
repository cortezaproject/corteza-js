import { PageBlock, Registry } from './base'
export { PageBlockAutomation } from './automation'
export { PageBlockChart } from './chart'
export { PageBlockContent } from './content'
export { PageBlockFile } from './file'
export { PageBlockRecord } from './record'
export { PageBlockRecordList } from './record-list'
export { PageBlockRecordOrganizer } from './record-organizer'
export { PageBlockSocialFeed } from './social-feed'
export { PageBlockCalendar } from './calendar'

export function PageBlockMaker (i: { kind: string }): PageBlock {
  if (!Registry.has(i.kind)) {
    throw new Error(`unknown block kind '${i.kind}'`)
  }

  return new (Registry.get(i.kind) as typeof PageBlock)(i)
}

export {
  Registry as PageBlockRegistry,
  PageBlock,
}
