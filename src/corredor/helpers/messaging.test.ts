import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { stubObject, StubbedInstance } from 'ts-sinon'
import { Messaging as MessagingAPI } from '../../api-clients'
import MessagingHelper from './messaging'
import { Channel } from '../../messaging'

describe(__filename, () => {
  describe('supporting functions', () => {
    describe('resolving channel', () => {
      let h: StubbedInstance<MessagingHelper>

      beforeEach(() => {
        h = stubObject<MessagingHelper>(
          new MessagingHelper({ MessagingAPI: new MessagingAPI({}) }),
          [
            'findChannelByID',
          ],
        )
      })

      it('should return first valid channel', async () => {
        const c = new Channel({ channelID: '333' })
        expect(await h.resolveChannel(undefined, null, false, 0, '', c)).to.deep.equal(c)
        expect(h.findChannelByID.notCalled, 'findChannelByID call not expected').true
      })

      it('should resolve id', async () => {
        const c = new Channel({ channelID: '444' })
        h.findChannelByID.resolves(c)
        expect(await h.resolveChannel(c.channelID)).to.deep.equal(c)
        expect(h.findChannelByID.calledOnceWith(c.channelID), 'findChannelByID call expected').true
      })
    })
  })

  describe.skip('helpers', () => {
    it('should have tests for sendMessage')
    it('should have tests for findChannels')
    it('should have tests for findChannelById')
    it('should have tests for directMessages')
    it('should have tests for saveChannel')
  })
})
