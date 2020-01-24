import { expect } from 'chai'
import { Page } from './page'

describe(__filename, () => {
  describe('page creation', () => {
    it('sanity check', () => {
      const p = new Page({
        title: 'test page',
        blocks: [],
        visible: true,
      })

      expect(p.visible).true
    })

    it('should make all kinds of block', () => {
      const p = new Page({
        title: 'test page',
        blocks: [
          { kind: 'Automation', xywh: [0, 0, 3, 3] },
          { kind: 'Chart', xywh: [0, 0, 3, 3] },
          { kind: 'Content', xywh: [0, 0, 3, 3] },
          { kind: 'File', xywh: [0, 0, 3, 3] },
          { kind: 'Record', xywh: [0, 0, 3, 3] },
          { kind: 'RecordList', xywh: [0, 0, 3, 3] },
          { kind: 'RecordOrganizer', xywh: [0, 0, 3, 3] },
          { kind: 'SocialFeed', xywh: [0, 0, 3, 3] },
        ],
      })
    })
  })
})
