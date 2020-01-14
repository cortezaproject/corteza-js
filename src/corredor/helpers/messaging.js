import { Channel } from '../../messaging/types/channel'
import { User } from '../../system/types/user'
import { extractID, genericPermissionUpdater, isFresh } from './shared'

/**
 * MessagingHelper provides layer over Messaging API and utilities that simplify automation script writing
 *
 */
export class Messaging {
  constructor (ctx = {}) {
    this.MessagingAPI = ctx.MessagingAPI

    this.$authUser = ctx.$authUser

    this.$channel = ctx.$channel
    this.$message = ctx.$message
  }

  /**
   * Sends message to Messaging channel or another user
   *
   * @example
   * // Script that greats all and every member in every channel
   * Messaging.findChannels().then(channels => {
   *   channels.forEach(async ch => {
   *     await Messaging.sendMessage('Hello members of ' + ch.name, ch)
   *
   *     for (let memberID of ch.members) {
   *       await System.findUserByID(memberID).then(u => {
   *         return Messaging.sendMessage(' ... and hello to you too ' + (u.name || u.email || u.handle), ch)
   *       })
   *     }
   *   })
   * })
   *
   * @param {string|Object} message
   * @property {string} message.message
   * @param {string|Channel|User} ch User, Channel object or ID
   * @returns {Promise<Message>}
   */
  async sendMessage (message, ch) {
    if (ch instanceof User) {
      ch = this.directChannel(ch)
    }

    this.resolveChannel(ch, this.$channel).then(ch => {
      if (typeof message === 'string') {
        message = { message }
      }

      message.channelID = ch.channelID
      return this.MessagingAPI.messageCreate(message)
    })
  }

  /**
   * Searches for channels
   *
   * @param filter
   * @returns {Promise<{filter: Object, set: Channel[]}>}
   */
  async findChannels (filter) {
    if (typeof filter === 'string') {
      filter = { query: filter }
    }

    return this.MessagingAPI.channelList(filter).then(set => {
      return set.map(m => new Channel(m))
    })
  }

  /**
   * Finds user by ID
   *
   * @param {string|Channel} channel
   * @return {Promise<Channel>}
   */
  async findChannelByID (channel) {
    const channelID = extractID(channel, 'channelID')
    return this.MessagingAPI.channelRead({ channelID }).then(r => new Channel(r))
  }

  /**
   * Creates direct channel between current and
   *
   * @param {User|Object|string} first user - object or string with ID
   * @param {User|Object|string} [second] user - object or string with ID, defaults to current user
   * @returns {Promise<Channel>}
   */
  async directChannel (first, second = this.$authUser) {
    const firstUserID = extractID(first, 'userID')
    const secondUserID = extractID(second, 'userID')

    if (firstUserID === secondUserID) {
      return Promise.reject(Error('can not send message to self'))
    }

    // Create a new group channel between users
    // backend will handle checks (unique)
    return this.saveChannel({
      type: 'group',
      members: [firstUserID, secondUserID],
    })
  }

  /**
   * Creates or updates a channel
   *
   * @example
   * saveChannel(new Channel({
   *   name: 'Foo',
   *   type: 'private', // public, group, private
   *   // members: ['231414', '231414', '231414'],
   * }))
   *
   *
   * @param {Channel} channel
   * @returns {Promise<Channel>}
   */
  async saveChannel (channel) {
    return Promise.resolve(channel).then(channel => {
      if (isFresh(channel.channelID)) {
        return this.MessagingAPI.channelCreate(channel)
      } else {
        return this.MessagingAPI.channelUpdate(channel)
      }
    })
  }

  /**
   * Deletes a channel
   *
   * @example
   * System.findChannelByID('9043824038').then(user => {
   *   return System.deleteUser(user)
   * })
   *
   * @param {Channel} channel
   * @returns {Promise<void>}
   */
  async deleteChannel (channel) {
    return Promise.resolve(channel).then(channel => {
      const channelID = extractID(channel, 'channelID')

      if (!isFresh(channelID)) {
        return this.MessagingAPI.channelDelete({ channelID })
      }
    })
  }

  /**
   * Resolves channels from the arguments and returns first valid
   *
   * Knows how to resolve from:
   *  - string that looks like an ID - find by id (fallback to find-by-handle)
   *  - string - find by handle
   *  - Channel object
   *  - object with channelID properties
   *
   * @param {...Channel|Object|string}
   * @property {string} [r.channelID]
   * @returns {Promise<User|User>}
   */
  async resolveChannel (...args) {
    for (let c of args) {
      // Resolve pending promises if any...
      c = await c

      if (!c) {
        continue
      }

      if (typeof c === 'string') {
        if (/^[0-9]+$/.test(c)) {
          // Looks like an ID, try to find it and fall back to handle
          return this.findChannelByID(c)
        }
      }

      if (typeof c !== 'object') {
        continue
      }

      if (c instanceof Channel) {
        // Already got what we need
        return c
      }

      // Other kind of object with properties that might hold channel ID
      const {
        channelID,
      } = c
      return this.resolveChannel(channelID)
    }

    return Promise.reject(Error('unexpected input type for channel resolver'))
  }

  /**
   * Sets permissions on messaging resources
   *
   * @example
   * Compose.setPermissions([
   *   // Allow someRole update to delete newChannel
   *   new AllowAccess(someRole, newChannel, 'delete'),
   *
   *   // Allow newRole to update any channel
   *   new AllowAccess(newRole, new WildcardResource(new Channel), 'update')
   * ])
   *
   * @param {PermissionRule[]} rules
   * @returns {Promise<void>}
   */
  async setPermissions (rules) {
    return genericPermissionUpdater(this.MessagingAPI, rules)
  }
}
