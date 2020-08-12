/* eslint-disable padded-blocks */

// This is a generated file.
// See README.md file for update instructions

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface KV {
  [header: string]: unknown;
}

interface Headers {
  [header: string]: string;
}

interface Ctor {
  baseURL?: string;
  jwt?: string;
  headers?: Headers;
}

interface CortezaResponse {
  error?: string;
  response?: unknown;
}

function stdResolve (response: AxiosResponse<CortezaResponse>): KV|Promise<never> {
  if (response.data.error) {
    return Promise.reject(response.data.error)
  } else {
    return response.data.response as KV
  }
}

export default class Messaging {
  protected baseURL?: string
  protected jwt?: string
  protected headers: Headers = {}

  constructor ({ baseURL, headers, jwt }: Ctor) {
    this.baseURL = baseURL

    this.headers = {
      'Content-Type': 'application/json',
    }

    this.setHeaders(headers)

    if (this.isValidJWT(jwt)) {
      this.setJWT(jwt)
    }
  }

  setJWT (jwt?: string): Messaging {
    if (this.isValidJWT(jwt)) {
      this.jwt = jwt
      this.headers.Authorization = 'Bearer ' + jwt
    } else {
      throw new Error('JWT value too short')
    }

    return this
  }

  setHeaders (headers?: Headers): Messaging {
    if (typeof headers === 'object') {
      this.headers = headers
    }

    return this
  }

  isValidJWT (jwt?: string): boolean {
    return !!jwt && jwt.length > 100
  }

  api (): AxiosInstance {
    return axios.create({
      withCredentials: true,
      baseURL: this.baseURL,
      headers: this.headers,
    })
  }

  // List of available commands
  async commandsList (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.commandsListEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  commandsListEndpoint (): string {
    return '/commands/'
  }

  // See all current statuses
  async statusList (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.statusListEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  statusListEndpoint (): string {
    return '/status/'
  }

  // Set user&#x27;s status
  async statusSet (a: KV): Promise<KV> {
    const {
      icon,
      message,
      expires,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.statusSetEndpoint(),
    }
    cfg.data = {
      icon,
      message,
      expires,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  statusSetEndpoint (): string {
    return '/status/'
  }

  // Clear status
  async statusDelete (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.statusDeleteEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  statusDeleteEndpoint (): string {
    return '/status/'
  }

  // Sends user&#x27;s activity to all subscribers; globally or per channel/message.
  async activitySend (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
      kind,
    } = (a as KV) || {}
    if (!kind) {
      console.error('activitySend failed, field kind is empty', a)
      throw Error('field kind is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.activitySendEndpoint(),
    }
    cfg.data = {
      channelID,
      messageID,
      kind,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  activitySendEndpoint (): string {
    return '/activity/'
  }

  // List channels
  async channelList (a: KV): Promise<KV> {
    const {
      query,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.channelListEndpoint(),
    }
    cfg.params = {
      query,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelListEndpoint (): string {
    return '/channels/'
  }

  // Create new channel
  async channelCreate (a: KV): Promise<KV> {
    const {
      name,
      topic,
      type,
      membershipPolicy,
      members,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.channelCreateEndpoint(),
    }
    cfg.data = {
      name,
      topic,
      type,
      membershipPolicy,
      members,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelCreateEndpoint (): string {
    return '/channels/'
  }

  // Update channel details
  async channelUpdate (a: KV): Promise<KV> {
    const {
      channelID,
      name,
      topic,
      membershipPolicy,
      type,
      organisationID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelUpdate failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
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
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelUpdateEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}`
  }

  // Update channel state
  async channelState (a: KV): Promise<KV> {
    const {
      channelID,
      state,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelState failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!state) {
      console.error('channelState failed, field state is empty', a)
      throw Error('field state is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.channelStateEndpoint({
        channelID,
      }),
    }
    cfg.data = {
      state,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelStateEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/state`
  }

  // Update channel membership flag
  async channelSetFlag (a: KV): Promise<KV> {
    const {
      channelID,
      flag,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelSetFlag failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!flag) {
      console.error('channelSetFlag failed, field flag is empty', a)
      throw Error('field flag is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.channelSetFlagEndpoint({
        channelID,
      }),
    }
    cfg.data = {
      flag,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelSetFlagEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/flag`
  }

  // Remove channel membership flag
  async channelRemoveFlag (a: KV): Promise<KV> {
    const {
      channelID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelRemoveFlag failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.channelRemoveFlagEndpoint({
        channelID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelRemoveFlagEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/flag`
  }

  // Read channel details
  async channelRead (a: KV): Promise<KV> {
    const {
      channelID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelRead failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.channelReadEndpoint({
        channelID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelReadEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}`
  }

  // List channel members
  async channelMembers (a: KV): Promise<KV> {
    const {
      channelID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelMembers failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.channelMembersEndpoint({
        channelID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelMembersEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/members`
  }

  // Join channel
  async channelJoin (a: KV): Promise<KV> {
    const {
      channelID,
      userID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelJoin failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.channelJoinEndpoint({
        channelID, userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelJoinEndpoint (a: KV): string {
    const {
      channelID,
      userID,
    } = a || {}
    return `/channels/${channelID}/members/${userID}`
  }

  // Remove member from channel
  async channelPart (a: KV): Promise<KV> {
    const {
      channelID,
      userID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelPart failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.channelPartEndpoint({
        channelID, userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelPartEndpoint (a: KV): string {
    const {
      channelID,
      userID,
    } = a || {}
    return `/channels/${channelID}/members/${userID}`
  }

  // Join channel
  async channelInvite (a: KV): Promise<KV> {
    const {
      channelID,
      userID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelInvite failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.channelInviteEndpoint({
        channelID,
      }),
    }
    cfg.data = {
      userID,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelInviteEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/invite`
  }

  // Attach file to channel
  async channelAttach (a: KV): Promise<KV> {
    const {
      channelID,
      replyTo,
      upload,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('channelAttach failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!upload) {
      console.error('channelAttach failed, field upload is empty', a)
      throw Error('field upload is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.channelAttachEndpoint({
        channelID,
      }),
    }
    cfg.data = {
      replyTo,
      upload,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  channelAttachEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/attach`
  }

  // Post new message to the channel
  async messageCreate (a: KV): Promise<KV> {
    const {
      channelID,
      message,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageCreate failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!message) {
      console.error('messageCreate failed, field message is empty', a)
      throw Error('field message is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.messageCreateEndpoint({
        channelID,
      }),
    }
    cfg.data = {
      message,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageCreateEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/messages/`
  }

  // Execute command
  async messageExecuteCommand (a: KV): Promise<KV> {
    const {
      channelID,
      command,
      input,
      params,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageExecuteCommand failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!command) {
      console.error('messageExecuteCommand failed, field command is empty', a)
      throw Error('field command is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.messageExecuteCommandEndpoint({
        channelID, command,
      }),
    }
    cfg.data = {
      input,
      params,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageExecuteCommandEndpoint (a: KV): string {
    const {
      channelID,
      command,
    } = a || {}
    return `/channels/${channelID}/messages/command/${command}/exec`
  }

  // Manages read/unread messages in a channel or a thread
  async messageMarkAsRead (a: KV): Promise<KV> {
    const {
      channelID,
      threadID,
      lastReadMessageID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageMarkAsRead failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.messageMarkAsReadEndpoint({
        channelID,
      }),
    }
    cfg.params = {
      threadID,
      lastReadMessageID,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageMarkAsReadEndpoint (a: KV): string {
    const {
      channelID,
    } = a || {}
    return `/channels/${channelID}/messages/mark-as-read`
  }

  // Edit existing message
  async messageEdit (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
      message,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageEdit failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageEdit failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    if (!message) {
      console.error('messageEdit failed, field message is empty', a)
      throw Error('field message is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.messageEditEndpoint({
        channelID, messageID,
      }),
    }
    cfg.data = {
      message,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageEditEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}`
  }

  // Delete existing message
  async messageDelete (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageDelete failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageDelete failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.messageDeleteEndpoint({
        channelID, messageID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageDeleteEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}`
  }

  // Reply to a message
  async messageReplyCreate (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
      message,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageReplyCreate failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageReplyCreate failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    if (!message) {
      console.error('messageReplyCreate failed, field message is empty', a)
      throw Error('field message is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.messageReplyCreateEndpoint({
        channelID, messageID,
      }),
    }
    cfg.data = {
      message,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageReplyCreateEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/replies`
  }

  // Pin message to channel (public bookmark)
  async messagePinCreate (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messagePinCreate failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messagePinCreate failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.messagePinCreateEndpoint({
        channelID, messageID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messagePinCreateEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/pin`
  }

  // Pin message to channel (public bookmark)
  async messagePinRemove (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messagePinRemove failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messagePinRemove failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.messagePinRemoveEndpoint({
        channelID, messageID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messagePinRemoveEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/pin`
  }

  // Bookmark a message (private bookmark)
  async messageBookmarkCreate (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageBookmarkCreate failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageBookmarkCreate failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.messageBookmarkCreateEndpoint({
        channelID, messageID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageBookmarkCreateEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/bookmark`
  }

  // Remove boomark from message (private bookmark)
  async messageBookmarkRemove (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageBookmarkRemove failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageBookmarkRemove failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.messageBookmarkRemoveEndpoint({
        channelID, messageID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageBookmarkRemoveEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/bookmark`
  }

  // React to a message
  async messageReactionCreate (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
      reaction,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageReactionCreate failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageReactionCreate failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    if (!reaction) {
      console.error('messageReactionCreate failed, field reaction is empty', a)
      throw Error('field reaction is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.messageReactionCreateEndpoint({
        channelID, messageID, reaction,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageReactionCreateEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
      reaction,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/reaction/${reaction}`
  }

  // Delete reaction from a message
  async messageReactionRemove (a: KV): Promise<KV> {
    const {
      channelID,
      messageID,
      reaction,
    } = (a as KV) || {}
    if (!channelID) {
      console.error('messageReactionRemove failed, field channelID is empty', a)
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      console.error('messageReactionRemove failed, field messageID is empty', a)
      throw Error('field messageID is empty')
    }
    if (!reaction) {
      console.error('messageReactionRemove failed, field reaction is empty', a)
      throw Error('field reaction is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.messageReactionRemoveEndpoint({
        channelID, messageID, reaction,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  messageReactionRemoveEndpoint (a: KV): string {
    const {
      channelID,
      messageID,
      reaction,
    } = a || {}
    return `/channels/${channelID}/messages/${messageID}/reaction/${reaction}`
  }

  // Serves attached file
  async attachmentOriginal (a: KV): Promise<KV> {
    const {
      attachmentID,
      name,
      sign,
      userID,
      download,
    } = (a as KV) || {}
    if (!attachmentID) {
      console.error('attachmentOriginal failed, field attachmentID is empty', a)
      throw Error('field attachmentID is empty')
    }
    if (!name) {
      console.error('attachmentOriginal failed, field name is empty', a)
      throw Error('field name is empty')
    }
    if (!sign) {
      console.error('attachmentOriginal failed, field sign is empty', a)
      throw Error('field sign is empty')
    }
    if (!userID) {
      console.error('attachmentOriginal failed, field userID is empty', a)
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.attachmentOriginalEndpoint({
        attachmentID, name,
      }),
    }
    cfg.params = {
      sign,
      userID,
      download,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  attachmentOriginalEndpoint (a: KV): string {
    const {
      attachmentID,
      name,
    } = a || {}
    return `/attachment/${attachmentID}/original/${name}`
  }

  // Serves preview of an attached file
  async attachmentPreview (a: KV): Promise<KV> {
    const {
      attachmentID,
      ext,
      sign,
      userID,
    } = (a as KV) || {}
    if (!attachmentID) {
      console.error('attachmentPreview failed, field attachmentID is empty', a)
      throw Error('field attachmentID is empty')
    }
    if (!ext) {
      console.error('attachmentPreview failed, field ext is empty', a)
      throw Error('field ext is empty')
    }
    if (!sign) {
      console.error('attachmentPreview failed, field sign is empty', a)
      throw Error('field sign is empty')
    }
    if (!userID) {
      console.error('attachmentPreview failed, field userID is empty', a)
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.attachmentPreviewEndpoint({
        attachmentID, ext,
      }),
    }
    cfg.params = {
      sign,
      userID,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  attachmentPreviewEndpoint (a: KV): string {
    const {
      attachmentID,
      ext,
    } = a || {}
    return `/attachment/${attachmentID}/preview.${ext}`
  }

  // Search for messages
  async searchMessages (a: KV): Promise<KV> {
    const {
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
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.searchMessagesEndpoint(),
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

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  searchMessagesEndpoint (): string {
    return '/search/messages'
  }

  // Search for threads
  async searchThreads (a: KV): Promise<KV> {
    const {
      query,
      channelID,
      limit,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.searchThreadsEndpoint(),
    }
    cfg.params = {
      query,
      channelID,
      limit,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  searchThreadsEndpoint (): string {
    return '/search/threads'
  }

  // Retrieve defined permissions
  async permissionsList (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.permissionsListEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  permissionsListEndpoint (): string {
    return '/permissions/'
  }

  // Effective rules for current user
  async permissionsEffective (a: KV): Promise<KV> {
    const {
      resource,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.permissionsEffectiveEndpoint(),
    }
    cfg.params = {
      resource,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  permissionsEffectiveEndpoint (): string {
    return '/permissions/effective'
  }

  // Retrieve role permissions
  async permissionsRead (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      console.error('permissionsRead failed, field roleID is empty', a)
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.permissionsReadEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  permissionsReadEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/permissions/${roleID}/rules`
  }

  // Remove all defined role permissions
  async permissionsDelete (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      console.error('permissionsDelete failed, field roleID is empty', a)
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.permissionsDeleteEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  permissionsDeleteEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/permissions/${roleID}/rules`
  }

  // Update permission settings
  async permissionsUpdate (a: KV): Promise<KV> {
    const {
      roleID,
      rules,
    } = (a as KV) || {}
    if (!roleID) {
      console.error('permissionsUpdate failed, field roleID is empty', a)
      throw Error('field roleID is empty')
    }
    if (!rules) {
      console.error('permissionsUpdate failed, field rules is empty', a)
      throw Error('field rules is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'patch',
      url: this.permissionsUpdateEndpoint({
        roleID,
      }),
    }
    cfg.data = {
      rules,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  permissionsUpdateEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/permissions/${roleID}/rules`
  }

  // List settings
  async settingsList (a: KV): Promise<KV> {
    const {
      prefix,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.settingsListEndpoint(),
    }
    cfg.params = {
      prefix,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  settingsListEndpoint (): string {
    return '/settings/'
  }

  // Update settings
  async settingsUpdate (a: KV): Promise<KV> {
    const {
      values,
    } = (a as KV) || {}
    if (!values) {
      console.error('settingsUpdate failed, field values is empty', a)
      throw Error('field values is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'patch',
      url: this.settingsUpdateEndpoint(),
    }
    cfg.data = {
      values,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  settingsUpdateEndpoint (): string {
    return '/settings/'
  }

  // Get a value for a key
  async settingsGet (a: KV): Promise<KV> {
    const {
      key,
      ownerID,
    } = (a as KV) || {}
    if (!key) {
      console.error('settingsGet failed, field key is empty', a)
      throw Error('field key is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.settingsGetEndpoint({
        key,
      }),
    }
    cfg.params = {
      ownerID,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  settingsGetEndpoint (a: KV): string {
    const {
      key,
    } = a || {}
    return `/settings/${key}`
  }

  // Current compose settings
  async settingsCurrent (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.settingsCurrentEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  settingsCurrentEndpoint (): string {
    return '/settings/current'
  }

}
