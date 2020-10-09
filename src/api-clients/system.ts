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

export default class System {
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

  setJWT (jwt?: string): System {
    if (this.isValidJWT(jwt)) {
      this.jwt = jwt
      this.headers.Authorization = 'Bearer ' + jwt
    } else {
      throw new Error('JWT value too short')
    }

    return this
  }

  setHeaders (headers?: Headers): System {
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

  // Returns auth settings
  async authSettings (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.authSettingsEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authSettingsEndpoint (): string {
    return '/auth/'
  }

  // Check JWT token
  async authCheck (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.authCheckEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authCheckEndpoint (): string {
    return '/auth/check'
  }

  // Impersonate a user
  async authImpersonate (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authImpersonateEndpoint(),
    }
    cfg.data = {
      userID,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authImpersonateEndpoint (): string {
    return '/auth/impersonate'
  }

  // Exchange auth token for JWT
  async authExchangeAuthToken (a: KV): Promise<KV> {
    const {
      token,
    } = (a as KV) || {}
    if (!token) {
      throw Error('field token is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authExchangeAuthTokenEndpoint(),
    }
    cfg.data = {
      token,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authExchangeAuthTokenEndpoint (): string {
    return '/auth/exchange'
  }

  // Logout
  async authLogout (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.authLogoutEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authLogoutEndpoint (): string {
    return '/auth/logout'
  }

  // Login user
  async authInternalLogin (a: KV): Promise<KV> {
    const {
      email,
      password,
    } = (a as KV) || {}
    if (!email) {
      throw Error('field email is empty')
    }
    if (!password) {
      throw Error('field password is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalLoginEndpoint(),
    }
    cfg.data = {
      email,
      password,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalLoginEndpoint (): string {
    return '/auth/internal/login'
  }

  // User signup/registration
  async authInternalSignup (a: KV): Promise<KV> {
    const {
      email,
      username,
      password,
      handle,
      name,
    } = (a as KV) || {}
    if (!email) {
      throw Error('field email is empty')
    }
    if (!password) {
      throw Error('field password is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalSignupEndpoint(),
    }
    cfg.data = {
      email,
      username,
      password,
      handle,
      name,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalSignupEndpoint (): string {
    return '/auth/internal/signup'
  }

  // Request password reset token (via email)
  async authInternalRequestPasswordReset (a: KV): Promise<KV> {
    const {
      email,
    } = (a as KV) || {}
    if (!email) {
      throw Error('field email is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalRequestPasswordResetEndpoint(),
    }
    cfg.data = {
      email,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalRequestPasswordResetEndpoint (): string {
    return '/auth/internal/request-password-reset'
  }

  // Exchange password reset token for new token and user info
  async authInternalExchangePasswordResetToken (a: KV): Promise<KV> {
    const {
      token,
    } = (a as KV) || {}
    if (!token) {
      throw Error('field token is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalExchangePasswordResetTokenEndpoint(),
    }
    cfg.data = {
      token,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalExchangePasswordResetTokenEndpoint (): string {
    return '/auth/internal/exchange-password-reset-token'
  }

  // Reset password with exchanged password reset token
  async authInternalResetPassword (a: KV): Promise<KV> {
    const {
      token,
      password,
    } = (a as KV) || {}
    if (!token) {
      throw Error('field token is empty')
    }
    if (!password) {
      throw Error('field password is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalResetPasswordEndpoint(),
    }
    cfg.data = {
      token,
      password,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalResetPasswordEndpoint (): string {
    return '/auth/internal/reset-password'
  }

  // Confirm email with token
  async authInternalConfirmEmail (a: KV): Promise<KV> {
    const {
      token,
    } = (a as KV) || {}
    if (!token) {
      throw Error('field token is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalConfirmEmailEndpoint(),
    }
    cfg.data = {
      token,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalConfirmEmailEndpoint (): string {
    return '/auth/internal/confirm-email'
  }

  // Changes password for current user, requires current password
  async authInternalChangePassword (a: KV): Promise<KV> {
    const {
      oldPassword,
      newPassword,
    } = (a as KV) || {}
    if (!oldPassword) {
      throw Error('field oldPassword is empty')
    }
    if (!newPassword) {
      throw Error('field newPassword is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.authInternalChangePasswordEndpoint(),
    }
    cfg.data = {
      oldPassword,
      newPassword,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  authInternalChangePasswordEndpoint (): string {
    return '/auth/internal/change-password'
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

  // Set value for specific setting
  async settingsSet (a: KV): Promise<KV> {
    const {
      key,
      upload,
      ownerID,
    } = (a as KV) || {}
    if (!key) {
      throw Error('field key is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.settingsSetEndpoint({
        key,
      }),
    }
    cfg.data = {
      upload,
      ownerID,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  settingsSetEndpoint (a: KV): string {
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

  // Returns current subscription status
  async subscriptionCurrent (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.subscriptionCurrentEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  subscriptionCurrentEndpoint (): string {
    return '/subscription/'
  }

  // List roles
  async roleList (a: KV): Promise<KV> {
    const {
      query,
      deleted,
      archived,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.roleListEndpoint(),
    }
    cfg.params = {
      query,
      deleted,
      archived,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleListEndpoint (): string {
    return '/roles/'
  }

  // Update role details
  async roleCreate (a: KV): Promise<KV> {
    const {
      name,
      handle,
      members,
    } = (a as KV) || {}
    if (!name) {
      throw Error('field name is empty')
    }
    if (!handle) {
      throw Error('field handle is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleCreateEndpoint(),
    }
    cfg.data = {
      name,
      handle,
      members,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleCreateEndpoint (): string {
    return '/roles/'
  }

  // Update role details
  async roleUpdate (a: KV): Promise<KV> {
    const {
      roleID,
      name,
      handle,
      members,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.roleUpdateEndpoint({
        roleID,
      }),
    }
    cfg.data = {
      name,
      handle,
      members,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleUpdateEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}`
  }

  // Read role details and memberships
  async roleRead (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.roleReadEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleReadEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}`
  }

  // Remove role
  async roleDelete (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.roleDeleteEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleDeleteEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}`
  }

  // Archive role
  async roleArchive (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleArchiveEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleArchiveEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/archive`
  }

  // Unarchive role
  async roleUnarchive (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleUnarchiveEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleUnarchiveEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/unarchive`
  }

  // Undelete role
  async roleUndelete (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleUndeleteEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleUndeleteEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/undelete`
  }

  // Move role to different organisation
  async roleMove (a: KV): Promise<KV> {
    const {
      roleID,
      organisationID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!organisationID) {
      throw Error('field organisationID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleMoveEndpoint({
        roleID,
      }),
    }
    cfg.data = {
      organisationID,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleMoveEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/move`
  }

  // Merge one role into another
  async roleMerge (a: KV): Promise<KV> {
    const {
      roleID,
      destination,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!destination) {
      throw Error('field destination is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleMergeEndpoint({
        roleID,
      }),
    }
    cfg.data = {
      destination,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleMergeEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/merge`
  }

  // Returns all role members
  async roleMemberList (a: KV): Promise<KV> {
    const {
      roleID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.roleMemberListEndpoint({
        roleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleMemberListEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/members`
  }

  // Add member to a role
  async roleMemberAdd (a: KV): Promise<KV> {
    const {
      roleID,
      userID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleMemberAddEndpoint({
        roleID, userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleMemberAddEndpoint (a: KV): string {
    const {
      roleID,
      userID,
    } = a || {}
    return `/roles/${roleID}/member/${userID}`
  }

  // Remove member from a role
  async roleMemberRemove (a: KV): Promise<KV> {
    const {
      roleID,
      userID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.roleMemberRemoveEndpoint({
        roleID, userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleMemberRemoveEndpoint (a: KV): string {
    const {
      roleID,
      userID,
    } = a || {}
    return `/roles/${roleID}/member/${userID}`
  }

  // Fire system:role trigger
  async roleTriggerScript (a: KV): Promise<KV> {
    const {
      roleID,
      script,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!script) {
      throw Error('field script is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.roleTriggerScriptEndpoint({
        roleID,
      }),
    }
    cfg.data = {
      script,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  roleTriggerScriptEndpoint (a: KV): string {
    const {
      roleID,
    } = a || {}
    return `/roles/${roleID}/trigger`
  }

  // Search users (Directory)
  async userList (a: KV): Promise<KV> {
    const {
      userID,
      roleID,
      query,
      username,
      email,
      handle,
      kind,
      incDeleted,
      incSuspended,
      deleted,
      suspended,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.userListEndpoint(),
    }
    cfg.params = {
      userID,
      roleID,
      query,
      username,
      email,
      handle,
      kind,
      incDeleted,
      incSuspended,
      deleted,
      suspended,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userListEndpoint (): string {
    return '/users/'
  }

  // Create user
  async userCreate (a: KV): Promise<KV> {
    const {
      email,
      name,
      handle,
      kind,
    } = (a as KV) || {}
    if (!email) {
      throw Error('field email is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userCreateEndpoint(),
    }
    cfg.data = {
      email,
      name,
      handle,
      kind,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userCreateEndpoint (): string {
    return '/users/'
  }

  // Update user details
  async userUpdate (a: KV): Promise<KV> {
    const {
      userID,
      email,
      name,
      handle,
      kind,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    if (!email) {
      throw Error('field email is empty')
    }
    if (!name) {
      throw Error('field name is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.userUpdateEndpoint({
        userID,
      }),
    }
    cfg.data = {
      email,
      name,
      handle,
      kind,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userUpdateEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}`
  }

  // Read user details
  async userRead (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.userReadEndpoint({
        userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userReadEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}`
  }

  // Remove user
  async userDelete (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.userDeleteEndpoint({
        userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userDeleteEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}`
  }

  // Suspend user
  async userSuspend (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userSuspendEndpoint({
        userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userSuspendEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}/suspend`
  }

  // Unsuspend user
  async userUnsuspend (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userUnsuspendEndpoint({
        userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userUnsuspendEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}/unsuspend`
  }

  // Undelete user
  async userUndelete (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userUndeleteEndpoint({
        userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userUndeleteEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}/undelete`
  }

  // Set&#x27;s or changes user&#x27;s password
  async userSetPassword (a: KV): Promise<KV> {
    const {
      userID,
      password,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    if (!password) {
      throw Error('field password is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userSetPasswordEndpoint({
        userID,
      }),
    }
    cfg.data = {
      password,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userSetPasswordEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}/password`
  }

  // Add member to a role
  async userMembershipList (a: KV): Promise<KV> {
    const {
      userID,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.userMembershipListEndpoint({
        userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userMembershipListEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}/membership`
  }

  // Add role to a user
  async userMembershipAdd (a: KV): Promise<KV> {
    const {
      roleID,
      userID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userMembershipAddEndpoint({
        roleID, userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userMembershipAddEndpoint (a: KV): string {
    const {
      roleID,
      userID,
    } = a || {}
    return `/users/${userID}/membership/${roleID}`
  }

  // Remove role from a user
  async userMembershipRemove (a: KV): Promise<KV> {
    const {
      roleID,
      userID,
    } = (a as KV) || {}
    if (!roleID) {
      throw Error('field roleID is empty')
    }
    if (!userID) {
      throw Error('field userID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.userMembershipRemoveEndpoint({
        roleID, userID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userMembershipRemoveEndpoint (a: KV): string {
    const {
      roleID,
      userID,
    } = a || {}
    return `/users/${userID}/membership/${roleID}`
  }

  // Fire system:user trigger
  async userTriggerScript (a: KV): Promise<KV> {
    const {
      userID,
      script,
    } = (a as KV) || {}
    if (!userID) {
      throw Error('field userID is empty')
    }
    if (!script) {
      throw Error('field script is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.userTriggerScriptEndpoint({
        userID,
      }),
    }
    cfg.data = {
      script,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  userTriggerScriptEndpoint (a: KV): string {
    const {
      userID,
    } = a || {}
    return `/users/${userID}/trigger`
  }

  // List applications
  async applicationList (a: KV): Promise<KV> {
    const {
      name,
      query,
      deleted,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.applicationListEndpoint(),
    }
    cfg.params = {
      name,
      query,
      deleted,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationListEndpoint (): string {
    return '/application/'
  }

  // Create application
  async applicationCreate (a: KV): Promise<KV> {
    const {
      name,
      enabled,
      unify,
      config,
    } = (a as KV) || {}
    if (!name) {
      throw Error('field name is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.applicationCreateEndpoint(),
    }
    cfg.data = {
      name,
      enabled,
      unify,
      config,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationCreateEndpoint (): string {
    return '/application/'
  }

  // Update user details
  async applicationUpdate (a: KV): Promise<KV> {
    const {
      applicationID,
      name,
      enabled,
      unify,
      config,
    } = (a as KV) || {}
    if (!applicationID) {
      throw Error('field applicationID is empty')
    }
    if (!name) {
      throw Error('field name is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.applicationUpdateEndpoint({
        applicationID,
      }),
    }
    cfg.data = {
      name,
      enabled,
      unify,
      config,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationUpdateEndpoint (a: KV): string {
    const {
      applicationID,
    } = a || {}
    return `/application/${applicationID}`
  }

  // Read application details
  async applicationRead (a: KV): Promise<KV> {
    const {
      applicationID,
    } = (a as KV) || {}
    if (!applicationID) {
      throw Error('field applicationID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.applicationReadEndpoint({
        applicationID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationReadEndpoint (a: KV): string {
    const {
      applicationID,
    } = a || {}
    return `/application/${applicationID}`
  }

  // Remove application
  async applicationDelete (a: KV): Promise<KV> {
    const {
      applicationID,
    } = (a as KV) || {}
    if (!applicationID) {
      throw Error('field applicationID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.applicationDeleteEndpoint({
        applicationID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationDeleteEndpoint (a: KV): string {
    const {
      applicationID,
    } = a || {}
    return `/application/${applicationID}`
  }

  // Undelete application
  async applicationUndelete (a: KV): Promise<KV> {
    const {
      applicationID,
    } = (a as KV) || {}
    if (!applicationID) {
      throw Error('field applicationID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.applicationUndeleteEndpoint({
        applicationID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationUndeleteEndpoint (a: KV): string {
    const {
      applicationID,
    } = a || {}
    return `/application/${applicationID}/undelete`
  }

  // Fire system:application trigger
  async applicationTriggerScript (a: KV): Promise<KV> {
    const {
      applicationID,
      script,
    } = (a as KV) || {}
    if (!applicationID) {
      throw Error('field applicationID is empty')
    }
    if (!script) {
      throw Error('field script is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.applicationTriggerScriptEndpoint({
        applicationID,
      }),
    }
    cfg.data = {
      script,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  applicationTriggerScriptEndpoint (a: KV): string {
    const {
      applicationID,
    } = a || {}
    return `/application/${applicationID}/trigger`
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

  // List/read reminders
  async reminderList (a: KV): Promise<KV> {
    const {
      reminderID,
      resource,
      assignedTo,
      scheduledFrom,
      scheduledUntil,
      scheduledOnly,
      excludeDismissed,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.reminderListEndpoint(),
    }
    cfg.params = {
      reminderID,
      resource,
      assignedTo,
      scheduledFrom,
      scheduledUntil,
      scheduledOnly,
      excludeDismissed,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderListEndpoint (): string {
    return '/reminder/'
  }

  // Add new reminder
  async reminderCreate (a: KV): Promise<KV> {
    const {
      resource,
      assignedTo,
      payload,
      remindAt,
    } = (a as KV) || {}
    if (!resource) {
      throw Error('field resource is empty')
    }
    if (!assignedTo) {
      throw Error('field assignedTo is empty')
    }
    if (!payload) {
      throw Error('field payload is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.reminderCreateEndpoint(),
    }
    cfg.data = {
      resource,
      assignedTo,
      payload,
      remindAt,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderCreateEndpoint (): string {
    return '/reminder/'
  }

  // Update reminder
  async reminderUpdate (a: KV): Promise<KV> {
    const {
      reminderID,
      resource,
      assignedTo,
      payload,
      remindAt,
    } = (a as KV) || {}
    if (!reminderID) {
      throw Error('field reminderID is empty')
    }
    if (!resource) {
      throw Error('field resource is empty')
    }
    if (!assignedTo) {
      throw Error('field assignedTo is empty')
    }
    if (!payload) {
      throw Error('field payload is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.reminderUpdateEndpoint({
        reminderID,
      }),
    }
    cfg.data = {
      resource,
      assignedTo,
      payload,
      remindAt,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderUpdateEndpoint (a: KV): string {
    const {
      reminderID,
    } = a || {}
    return `/reminder/${reminderID}`
  }

  // Read reminder by ID
  async reminderRead (a: KV): Promise<KV> {
    const {
      reminderID,
    } = (a as KV) || {}
    if (!reminderID) {
      throw Error('field reminderID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.reminderReadEndpoint({
        reminderID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderReadEndpoint (a: KV): string {
    const {
      reminderID,
    } = a || {}
    return `/reminder/${reminderID}`
  }

  // Delete reminder
  async reminderDelete (a: KV): Promise<KV> {
    const {
      reminderID,
    } = (a as KV) || {}
    if (!reminderID) {
      throw Error('field reminderID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.reminderDeleteEndpoint({
        reminderID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderDeleteEndpoint (a: KV): string {
    const {
      reminderID,
    } = a || {}
    return `/reminder/${reminderID}`
  }

  // Dismiss reminder
  async reminderDismiss (a: KV): Promise<KV> {
    const {
      reminderID,
    } = (a as KV) || {}
    if (!reminderID) {
      throw Error('field reminderID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'patch',
      url: this.reminderDismissEndpoint({
        reminderID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderDismissEndpoint (a: KV): string {
    const {
      reminderID,
    } = a || {}
    return `/reminder/${reminderID}/dismiss`
  }

  // Snooze reminder
  async reminderSnooze (a: KV): Promise<KV> {
    const {
      reminderID,
      remindAt,
    } = (a as KV) || {}
    if (!reminderID) {
      throw Error('field reminderID is empty')
    }
    if (!remindAt) {
      throw Error('field remindAt is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'patch',
      url: this.reminderSnoozeEndpoint({
        reminderID,
      }),
    }
    cfg.data = {
      remindAt,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  reminderSnoozeEndpoint (a: KV): string {
    const {
      reminderID,
    } = a || {}
    return `/reminder/${reminderID}/snooze`
  }

  // Attachment details
  async attachmentRead (a: KV): Promise<KV> {
    const {
      kind,
      attachmentID,
      sign,
      userID,
    } = (a as KV) || {}
    if (!kind) {
      throw Error('field kind is empty')
    }
    if (!attachmentID) {
      throw Error('field attachmentID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.attachmentReadEndpoint({
        kind, attachmentID,
      }),
    }
    cfg.params = {
      sign,
      userID,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  attachmentReadEndpoint (a: KV): string {
    const {
      kind,
      attachmentID,
    } = a || {}
    return `/attachment/${kind}/${attachmentID}`
  }

  // Delete attachment
  async attachmentDelete (a: KV): Promise<KV> {
    const {
      kind,
      attachmentID,
      sign,
      userID,
    } = (a as KV) || {}
    if (!kind) {
      throw Error('field kind is empty')
    }
    if (!attachmentID) {
      throw Error('field attachmentID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.attachmentDeleteEndpoint({
        kind, attachmentID,
      }),
    }
    cfg.params = {
      sign,
      userID,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  attachmentDeleteEndpoint (a: KV): string {
    const {
      kind,
      attachmentID,
    } = a || {}
    return `/attachment/${kind}/${attachmentID}`
  }

  // Serves attached file
  async attachmentOriginal (a: KV): Promise<KV> {
    const {
      kind,
      attachmentID,
      name,
      sign,
      userID,
      download,
    } = (a as KV) || {}
    if (!kind) {
      throw Error('field kind is empty')
    }
    if (!attachmentID) {
      throw Error('field attachmentID is empty')
    }
    if (!name) {
      throw Error('field name is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.attachmentOriginalEndpoint({
        kind, attachmentID, name,
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
      kind,
      attachmentID,
      name,
    } = a || {}
    return `/attachment/${kind}/${attachmentID}/original/${name}`
  }

  // Serves preview of an attached file
  async attachmentPreview (a: KV): Promise<KV> {
    const {
      kind,
      attachmentID,
      ext,
      sign,
      userID,
    } = (a as KV) || {}
    if (!kind) {
      throw Error('field kind is empty')
    }
    if (!attachmentID) {
      throw Error('field attachmentID is empty')
    }
    if (!ext) {
      throw Error('field ext is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.attachmentPreviewEndpoint({
        kind, attachmentID, ext,
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
      kind,
      attachmentID,
      ext,
    } = a || {}
    return `/attachment/${kind}/${attachmentID}/preview.${ext}`
  }

  // List system statistics
  async statsList (): Promise<KV> {

    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.statsListEndpoint(),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  statsListEndpoint (): string {
    return '/stats/'
  }

  // List all available automation scripts for system resources
  async automationList (a: KV): Promise<KV> {
    const {
      resourceTypePrefixes,
      resourceTypes,
      eventTypes,
      excludeInvalid,
      excludeClientScripts,
      excludeServerScripts,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.automationListEndpoint(),
    }
    cfg.params = {
      resourceTypePrefixes,
      resourceTypes,
      eventTypes,
      excludeInvalid,
      excludeClientScripts,
      excludeServerScripts,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  automationListEndpoint (): string {
    return '/automation/'
  }

  // Serves client scripts bundle
  async automationBundle (a: KV): Promise<KV> {
    const {
      bundle,
      type,
      ext,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.automationBundleEndpoint({
        bundle, type, ext,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  automationBundleEndpoint (a: KV): string {
    const {
      bundle,
      type,
      ext,
    } = a || {}
    return `/automation/${bundle}-${type}.${ext}`
  }

  // Triggers execution of a specific script on a system service level
  async automationTriggerScript (a: KV): Promise<KV> {
    const {
      script,
    } = (a as KV) || {}
    if (!script) {
      throw Error('field script is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.automationTriggerScriptEndpoint(),
    }
    cfg.data = {
      script,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  automationTriggerScriptEndpoint (): string {
    return '/automation/trigger'
  }

  // Action log events
  async actionlogList (a: KV): Promise<KV> {
    const {
      from,
      to,
      resource,
      action,
      actorID,
      limit,
      pageCursor,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.actionlogListEndpoint(),
    }
    cfg.params = {
      from,
      to,
      resource,
      action,
      actorID,
      limit,
      pageCursor,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  actionlogListEndpoint (): string {
    return '/actionlog/'
  }

}
