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
  accessTokenFn: () => string | undefined
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
  protected accessTokenFn?: () => string | undefined
  protected headers: Headers = {}

  constructor ({ baseURL, headers, accessTokenFn }: Ctor) {
    this.baseURL = baseURL
    this.accessTokenFn = accessTokenFn
    this.headers = {
      'Content-Type': 'application/json'
    }

    this.setHeaders(headers)
  }

  setAccessTokenFn (fn: () => string | undefined): Messaging {
    this.accessTokenFn = fn
    return this
  }

  setHeaders (headers?: Headers): Messaging {
    if (typeof headers === 'object') {
      this.headers = headers
    }

    return this
  }

  api (): AxiosInstance {
    const headers = { ...this.headers }
    const accessToken = this.accessTokenFn ? this.accessTokenFn() : undefined
    if (accessToken) {
      headers.Authorization = 'Bearer ' + accessToken
    }

    return axios.create({
      withCredentials: true,
      baseURL: this.baseURL,
      headers,
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
      throw Error('field channelID is empty')
    }
    if (!state) {
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
      throw Error('field channelID is empty')
    }
    if (!flag) {
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
      throw Error('field channelID is empty')
    }
    if (!upload) {
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
      throw Error('field channelID is empty')
    }
    if (!message) {
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
      throw Error('field channelID is empty')
    }
    if (!command) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      throw Error('field messageID is empty')
    }
    if (!message) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      throw Error('field messageID is empty')
    }
    if (!message) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      throw Error('field messageID is empty')
    }
    if (!reaction) {
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
      throw Error('field channelID is empty')
    }
    if (!messageID) {
      throw Error('field messageID is empty')
    }
    if (!reaction) {
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
      throw Error('field attachmentID is empty')
    }
    if (!name) {
      throw Error('field name is empty')
    }
    if (!sign) {
      throw Error('field sign is empty')
    }
    if (!userID) {
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
      throw Error('field attachmentID is empty')
    }
    if (!ext) {
      throw Error('field ext is empty')
    }
    if (!sign) {
      throw Error('field sign is empty')
    }
    if (!userID) {
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
      throw Error('field roleID is empty')
    }
    if (!rules) {
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

}
