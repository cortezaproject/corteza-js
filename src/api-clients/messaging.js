import axios from 'axios'

/* eslint-disable */

// This is a generated file.
// See README.md file for update instructions

export default class Messaging {
  constructor ({baseURL, headers, jwt} = {}) {
    this.jwt = null
    this.baseURL = baseURL

    this.headers = {
      'Content-Type': 'application/json',
    }

    this.setHeaders(headers)

    if (this.isValidJWT(jwt)) {
      this.setJWT(jwt)
    }
  }

  setJWT (jwt) {
    if (this.isValidJWT(jwt)) {
      this.jwt = jwt
      this.headers['Authorization'] = 'Bearer ' + jwt
    } else {
      throw new Error('JWT value too short', {
        jwt,
      })
    }

    return this
  }

  setHeaders (headers) {
    if (typeof headers === 'object') {
      this.headers = headers
    }

    return this
  }

  isValidJWT (jwt) {
    return jwt && jwt.length > 100
  }

  stdReject (reject) {
    return (error) => {
      reject(error)
    }
  }

  stdResolve (resolve, reject) {
    return (response) => {
      if (response.data.error) {
        reject(response.data.error)
      } else {
        resolve(response.data.response)
      }
    }
  }

  api () {
    return axios.create({
      withCredentials: true,
      baseURL: this.baseURL,
      headers: this.headers,
    })
  }

  // List of available commands
  async commandsList () {



    let cfg = {
      method: 'get',
      url: this.commandsListEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  commandsListEndpoint () {
    return `/commands/`
  }

  // See all current statuses
  async statusList () {



    let cfg = {
      method: 'get',
      url: this.statusListEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  statusListEndpoint () {
    return `/status/`
  }

  // Set user&#x27;s status
  async statusSet () {
    const {icon, message, expires, } = arguments[0] || {}


    let cfg = {
      method: 'post',
      url: this.statusSetEndpoint({  }),
    }

    cfg.data = {
      icon,
      message,
      expires,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  statusSetEndpoint () {
    return `/status/`
  }

  // Clear status
  async statusDelete () {



    let cfg = {
      method: 'delete',
      url: this.statusDeleteEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  statusDeleteEndpoint () {
    return `/status/`
  }

  // Sends user&#x27;s activity to all subscribers; globally or per channel/message.
  async activitySend () {
    const {channelID, messageID, kind, } = arguments[0] || {}
    if (!kind) {
      console.error('activitySend failed, field kind is empty', arguments) // log error so we can debug/trace it
      throw Error('field kind is empty')
    }

    let cfg = {
      method: 'post',
      url: this.activitySendEndpoint({  }),
    }

    cfg.data = {
      channelID,
      messageID,
      kind,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  activitySendEndpoint () {
    return `/activity/`
  }

  // List channels
  async channelList () {
    const {query, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.channelListEndpoint({  }),
    }
    cfg.params = {
      query,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelListEndpoint () {
    return `/channels/`
  }

  // Create new channel
  async channelCreate () {
    const {name, topic, type, membershipPolicy, members, } = arguments[0] || {}


    let cfg = {
      method: 'post',
      url: this.channelCreateEndpoint({  }),
    }

    cfg.data = {
      name,
      topic,
      type,
      membershipPolicy,
      members,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelCreateEndpoint () {
    return `/channels/`
  }

  // Update channel details
  async channelUpdate () {
    const {channelID, name, topic, membershipPolicy, type, organisationID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelUpdate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'put',
      url: this.channelUpdateEndpoint({
        channelID,
      }),
    }

    cfg.data = {
      name,
      topic,
      membershipPolicy,
      type,
      organisationID,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelUpdateEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}`
  }

  // Update channel state
  async channelState () {
    const {channelID, state, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelState failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!state) {
      console.error('channelState failed, field state is empty', arguments) // log error so we can debug/trace it
      throw Error('field state is empty')
    }

    let cfg = {
      method: 'put',
      url: this.channelStateEndpoint({
        channelID,
      }),
    }

    cfg.data = {
      state,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelStateEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/state`
  }

  // Update channel membership flag
  async channelSetFlag () {
    const {channelID, flag, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelSetFlag failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!flag) {
      console.error('channelSetFlag failed, field flag is empty', arguments) // log error so we can debug/trace it
      throw Error('field flag is empty')
    }

    let cfg = {
      method: 'put',
      url: this.channelSetFlagEndpoint({
        channelID,
      }),
    }

    cfg.data = {
      flag,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelSetFlagEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/flag`
  }

  // Remove channel membership flag
  async channelRemoveFlag () {
    const {channelID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelRemoveFlag failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.channelRemoveFlagEndpoint({
        channelID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelRemoveFlagEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/flag`
  }

  // Read channel details
  async channelRead () {
    const {channelID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelRead failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.channelReadEndpoint({
        channelID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelReadEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}`
  }

  // List channel members
  async channelMembers () {
    const {channelID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelMembers failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.channelMembersEndpoint({
        channelID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelMembersEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/members`
  }

  // Join channel
  async channelJoin () {
    const {channelID, userID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelJoin failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'put',
      url: this.channelJoinEndpoint({
        channelID,
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelJoinEndpoint ({channelID, userID, } = {}) {
    return `/channels/${channelID}/members/${userID}`
  }

  // Remove member from channel
  async channelPart () {
    const {channelID, userID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelPart failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.channelPartEndpoint({
        channelID,
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelPartEndpoint ({channelID, userID, } = {}) {
    return `/channels/${channelID}/members/${userID}`
  }

  // Join channel
  async channelInvite () {
    const {channelID, userID, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelInvite failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.channelInviteEndpoint({
        channelID,
      }),
    }

    cfg.data = {
      userID,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelInviteEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/invite`
  }

  // Attach file to channel
  async channelAttach () {
    const {channelID, replyTo, upload, } = arguments[0] || {}
    if (!channelID) {
      console.error('channelAttach failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!upload) {
      console.error('channelAttach failed, field upload is empty', arguments) // log error so we can debug/trace it
      throw Error('field upload is empty')
    }

    let cfg = {
      method: 'post',
      url: this.channelAttachEndpoint({
        channelID,
      }),
    }

    cfg.data = {
      replyTo,
      upload,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  channelAttachEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/attach`
  }

  // Post new message to the channel
  async messageCreate () {
    const {channelID, message, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageCreate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!message) {
      console.error('messageCreate failed, field message is empty', arguments) // log error so we can debug/trace it
      throw Error('field message is empty')
    }

    let cfg = {
      method: 'post',
      url: this.messageCreateEndpoint({
        channelID,
      }),
    }

    cfg.data = {
      message,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageCreateEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/messages/`
  }

  // Execute command
  async messageExecuteCommand () {
    const {channelID, command, input, params, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageExecuteCommand failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!command) {
      console.error('messageExecuteCommand failed, field command is empty', arguments) // log error so we can debug/trace it
      throw Error('field command is empty')
    }

    let cfg = {
      method: 'post',
      url: this.messageExecuteCommandEndpoint({
        channelID,
        command,
      }),
    }

    cfg.data = {
      input,
      params,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageExecuteCommandEndpoint ({channelID, command, } = {}) {
    return `/channels/${channelID}/messages/command/${command}/exec`
  }

  // Manages read/unread messages in a channel or a thread
  async messageMarkAsRead () {
    const {channelID, threadID, lastReadMessageID, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageMarkAsRead failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.messageMarkAsReadEndpoint({
        channelID,
      }),
    }
    cfg.params = {
      threadID,
      lastReadMessageID,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageMarkAsReadEndpoint ({channelID, } = {}) {
    return `/channels/${channelID}/messages/mark-as-read`
  }

  // Edit existing message
  async messageEdit () {
    const {channelID, messageID, message, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageEdit failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageEdit failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }
    if (!message) {
      console.error('messageEdit failed, field message is empty', arguments) // log error so we can debug/trace it
      throw Error('field message is empty')
    }

    let cfg = {
      method: 'put',
      url: this.messageEditEndpoint({
        channelID,
        messageID,
      }),
    }

    cfg.data = {
      message,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageEditEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}`
  }

  // Delete existing message
  async messageDelete () {
    const {channelID, messageID, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageDelete failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageDelete failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.messageDeleteEndpoint({
        channelID,
        messageID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageDeleteEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}`
  }

  // Reply to a message
  async messageReplyCreate () {
    const {channelID, messageID, message, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageReplyCreate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageReplyCreate failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }
    if (!message) {
      console.error('messageReplyCreate failed, field message is empty', arguments) // log error so we can debug/trace it
      throw Error('field message is empty')
    }

    let cfg = {
      method: 'post',
      url: this.messageReplyCreateEndpoint({
        channelID,
        messageID,
      }),
    }

    cfg.data = {
      message,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageReplyCreateEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/replies`
  }

  // Pin message to channel (public bookmark)
  async messagePinCreate () {
    const {channelID, messageID, } = arguments[0] || {}
    if (!channelID) {
      console.error('messagePinCreate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messagePinCreate failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.messagePinCreateEndpoint({
        channelID,
        messageID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messagePinCreateEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/pin`
  }

  // Pin message to channel (public bookmark)
  async messagePinRemove () {
    const {channelID, messageID, } = arguments[0] || {}
    if (!channelID) {
      console.error('messagePinRemove failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messagePinRemove failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.messagePinRemoveEndpoint({
        channelID,
        messageID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messagePinRemoveEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/pin`
  }

  // Bookmark a message (private bookmark)
  async messageBookmarkCreate () {
    const {channelID, messageID, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageBookmarkCreate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageBookmarkCreate failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.messageBookmarkCreateEndpoint({
        channelID,
        messageID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageBookmarkCreateEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/bookmark`
  }

  // Remove boomark from message (private bookmark)
  async messageBookmarkRemove () {
    const {channelID, messageID, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageBookmarkRemove failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageBookmarkRemove failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.messageBookmarkRemoveEndpoint({
        channelID,
        messageID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageBookmarkRemoveEndpoint ({channelID, messageID, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/bookmark`
  }

  // React to a message
  async messageReactionCreate () {
    const {channelID, messageID, reaction, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageReactionCreate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageReactionCreate failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }
    if (!reaction) {
      console.error('messageReactionCreate failed, field reaction is empty', arguments) // log error so we can debug/trace it
      throw Error('field reaction is empty')
    }

    let cfg = {
      method: 'post',
      url: this.messageReactionCreateEndpoint({
        channelID,
        messageID,
        reaction,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageReactionCreateEndpoint ({channelID, messageID, reaction, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/reaction/${reaction}`
  }

  // Delete reaction from a message
  async messageReactionRemove () {
    const {channelID, messageID, reaction, } = arguments[0] || {}
    if (!channelID) {
      console.error('messageReactionRemove failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageReactionRemove failed, field messageID is empty', arguments) // log error so we can debug/trace it
      throw Error('field messageID is empty')
    }
    if (!reaction) {
      console.error('messageReactionRemove failed, field reaction is empty', arguments) // log error so we can debug/trace it
      throw Error('field reaction is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.messageReactionRemoveEndpoint({
        channelID,
        messageID,
        reaction,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  messageReactionRemoveEndpoint ({channelID, messageID, reaction, } = {}) {
    return `/channels/${channelID}/messages/${messageID}/reaction/${reaction}`
  }

  // Serves attached file
  async attachmentOriginal () {
    const {attachmentID, name, sign, userID, download, } = arguments[0] || {}
    if (!attachmentID) {
      console.error('attachmentOriginal failed, field attachmentID is empty', arguments) // log error so we can debug/trace it
      throw Error('field attachmentID is empty')
    }
    if (!name) {
      console.error('attachmentOriginal failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }
    if (!sign) {
      console.error('attachmentOriginal failed, field sign is empty', arguments) // log error so we can debug/trace it
      throw Error('field sign is empty')
    }
    if (!userID) {
      console.error('attachmentOriginal failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.attachmentOriginalEndpoint({
        attachmentID,
        name,
      }),
    }
    cfg.params = {
      sign,
      userID,
      download,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  attachmentOriginalEndpoint ({attachmentID, name, } = {}) {
    return `/attachment/${attachmentID}/original/${name}`
  }

  // Serves preview of an attached file
  async attachmentPreview () {
    const {attachmentID, ext, sign, userID, } = arguments[0] || {}
    if (!attachmentID) {
      console.error('attachmentPreview failed, field attachmentID is empty', arguments) // log error so we can debug/trace it
      throw Error('field attachmentID is empty')
    }
    if (!ext) {
      console.error('attachmentPreview failed, field ext is empty', arguments) // log error so we can debug/trace it
      throw Error('field ext is empty')
    }
    if (!sign) {
      console.error('attachmentPreview failed, field sign is empty', arguments) // log error so we can debug/trace it
      throw Error('field sign is empty')
    }
    if (!userID) {
      console.error('attachmentPreview failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.attachmentPreviewEndpoint({
        attachmentID,
        ext,
      }),
    }
    cfg.params = {
      sign,
      userID,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  attachmentPreviewEndpoint ({attachmentID, ext, } = {}) {
    return `/attachment/${attachmentID}/preview.${ext}`
  }

  // Search for messages
  async searchMessages () {
    const {query, channelID, afterMessageID, beforeMessageID, fromMessageID, toMessageID, threadID, userID, type, pinnedOnly, bookmarkedOnly, limit, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.searchMessagesEndpoint({  }),
    }
    cfg.params = {
      query,
      channelID,
      afterMessageID,
      beforeMessageID,
      fromMessageID,
      toMessageID,
      threadID,
      userID,
      type,
      pinnedOnly,
      bookmarkedOnly,
      limit,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  searchMessagesEndpoint () {
    return `/search/messages`
  }

  // Search for threads
  async searchThreads () {
    const {query, channelID, limit, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.searchThreadsEndpoint({  }),
    }
    cfg.params = {
      query,
      channelID,
      limit,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  searchThreadsEndpoint () {
    return `/search/threads`
  }

  // List created webhooks
  async webhooksList () {
    const {channelID, userID, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.webhooksListEndpoint({  }),
    }
    cfg.params = {
      channelID,
      userID,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksListEndpoint () {
    return `/webhooks/`
  }

  // Create webhook
  async webhooksCreate () {
    const {channelID, kind, userID, trigger, url, username, avatar, avatarURL, } = arguments[0] || {}
    if (!channelID) {
      console.error('webhooksCreate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!kind) {
      console.error('webhooksCreate failed, field kind is empty', arguments) // log error so we can debug/trace it
      throw Error('field kind is empty')
    }
    if (!userID) {
      console.error('webhooksCreate failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.webhooksCreateEndpoint({  }),
    }

    cfg.data = {
      channelID,
      kind,
      userID,
      trigger,
      url,
      username,
      avatar,
      avatarURL,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksCreateEndpoint () {
    return `/webhooks/`
  }

  // Attach file to channel
  async webhooksUpdate () {
    const {webhookID, channelID, kind, userID, trigger, url, username, avatar, avatarURL, } = arguments[0] || {}
    if (!webhookID) {
      console.error('webhooksUpdate failed, field webhookID is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookID is empty')
    }
    if (!channelID) {
      console.error('webhooksUpdate failed, field channelID is empty', arguments) // log error so we can debug/trace it
      throw Error('field channelID is empty')
    }
    if (!kind) {
      console.error('webhooksUpdate failed, field kind is empty', arguments) // log error so we can debug/trace it
      throw Error('field kind is empty')
    }
    if (!userID) {
      console.error('webhooksUpdate failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.webhooksUpdateEndpoint({
        webhookID,
      }),
    }

    cfg.data = {
      channelID,
      kind,
      userID,
      trigger,
      url,
      username,
      avatar,
      avatarURL,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksUpdateEndpoint ({webhookID, } = {}) {
    return `/webhooks/${webhookID}`
  }

  // Get webhook details
  async webhooksGet () {
    const {webhookID, } = arguments[0] || {}
    if (!webhookID) {
      console.error('webhooksGet failed, field webhookID is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.webhooksGetEndpoint({
        webhookID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksGetEndpoint ({webhookID, } = {}) {
    return `/webhooks/${webhookID}`
  }

  // Delete webhook
  async webhooksDelete () {
    const {webhookID, } = arguments[0] || {}
    if (!webhookID) {
      console.error('webhooksDelete failed, field webhookID is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.webhooksDeleteEndpoint({
        webhookID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksDeleteEndpoint ({webhookID, } = {}) {
    return `/webhooks/${webhookID}`
  }

  // Delete webhook
  async webhooksPublicDelete () {
    const {webhookID, webhookToken, } = arguments[0] || {}
    if (!webhookID) {
      console.error('webhooksPublicDelete failed, field webhookID is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookID is empty')
    }
    if (!webhookToken) {
      console.error('webhooksPublicDelete failed, field webhookToken is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookToken is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.webhooksPublicDeleteEndpoint({
        webhookID,
        webhookToken,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksPublicDeleteEndpoint ({webhookID, webhookToken, } = {}) {
    return `/webhooks/${webhookID}/${webhookToken}`
  }

  // Create a message from a webhook payload
  async webhooksPublicCreate () {
    const {webhookID, webhookToken, username, avatarURL, content, } = arguments[0] || {}
    if (!webhookID) {
      console.error('webhooksPublicCreate failed, field webhookID is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookID is empty')
    }
    if (!webhookToken) {
      console.error('webhooksPublicCreate failed, field webhookToken is empty', arguments) // log error so we can debug/trace it
      throw Error('field webhookToken is empty')
    }
    if (!content) {
      console.error('webhooksPublicCreate failed, field content is empty', arguments) // log error so we can debug/trace it
      throw Error('field content is empty')
    }

    let cfg = {
      method: 'post',
      url: this.webhooksPublicCreateEndpoint({
        webhookID,
        webhookToken,
      }),
    }
    cfg.params = {
      username,
      avatarURL,
      content,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  webhooksPublicCreateEndpoint ({webhookID, webhookToken, } = {}) {
    return `/webhooks/${webhookID}/${webhookToken}`
  }

  // Retrieve defined permissions
  async permissionsList () {



    let cfg = {
      method: 'get',
      url: this.permissionsListEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  permissionsListEndpoint () {
    return `/permissions/`
  }

  // Effective rules for current user
  async permissionsEffective () {
    const {resource, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.permissionsEffectiveEndpoint({  }),
    }
    cfg.params = {
      resource,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  permissionsEffectiveEndpoint () {
    return `/permissions/effective`
  }

  // Retrieve role permissions
  async permissionsRead () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('permissionsRead failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.permissionsReadEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  permissionsReadEndpoint ({roleID, } = {}) {
    return `/permissions/${roleID}/rules`
  }

  // Remove all defined role permissions
  async permissionsDelete () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('permissionsDelete failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.permissionsDeleteEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  permissionsDeleteEndpoint ({roleID, } = {}) {
    return `/permissions/${roleID}/rules`
  }

  // Update permission settings
  async permissionsUpdate () {
    const {roleID, rules, } = arguments[0] || {}
    if (!roleID) {
      console.error('permissionsUpdate failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!rules) {
      console.error('permissionsUpdate failed, field rules is empty', arguments) // log error so we can debug/trace it
      throw Error('field rules is empty')
    }

    let cfg = {
      method: 'patch',
      url: this.permissionsUpdateEndpoint({
        roleID,
      }),
    }

    cfg.data = {
      rules,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  permissionsUpdateEndpoint ({roleID, } = {}) {
    return `/permissions/${roleID}/rules`
  }

  // List settings
  async settingsList () {
    const {prefix, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.settingsListEndpoint({  }),
    }
    cfg.params = {
      prefix,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  settingsListEndpoint () {
    return `/settings/`
  }

  // Update settings
  async settingsUpdate () {
    const {values, } = arguments[0] || {}
    if (!values) {
      console.error('settingsUpdate failed, field values is empty', arguments) // log error so we can debug/trace it
      throw Error('field values is empty')
    }

    let cfg = {
      method: 'patch',
      url: this.settingsUpdateEndpoint({  }),
    }

    cfg.data = {
      values,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  settingsUpdateEndpoint () {
    return `/settings/`
  }

  // Get a value for a key
  async settingsGet () {
    const {key, ownerID, } = arguments[0] || {}
    if (!key) {
      console.error('settingsGet failed, field key is empty', arguments) // log error so we can debug/trace it
      throw Error('field key is empty')
    }

    let cfg = {
      method: 'get',
      url: this.settingsGetEndpoint({
        key,
      }),
    }
    cfg.params = {
      ownerID,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  settingsGetEndpoint ({key, } = {}) {
    return `/settings/${key}`
  }

  // Current compose settings
  async settingsCurrent () {



    let cfg = {
      method: 'get',
      url: this.settingsCurrentEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  settingsCurrentEndpoint () {
    return `/settings/current`
  }

}
