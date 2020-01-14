import axios from 'axios'

/* eslint-disable */

// This is a generated file.
// See README.md file for update instructions

export class System {
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

  // Returns auth settings
  async authSettings () {



    let cfg = {
      method: 'get',
      url: this.authSettingsEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authSettingsEndpoint () {
    return `/auth/`
  }

  // Check JWT token
  async authCheck () {



    let cfg = {
      method: 'get',
      url: this.authCheckEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authCheckEndpoint () {
    return `/auth/check`
  }

  // Exchange auth token for JWT
  async authExchangeAuthToken () {
    const {token, } = arguments[0] || {}
    if (!token) {
      console.error('authExchangeAuthToken failed, field token is empty', arguments) // log error so we can debug/trace it
      throw Error('field token is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authExchangeAuthTokenEndpoint({  }),
    }

    cfg.data = {
      token,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authExchangeAuthTokenEndpoint () {
    return `/auth/exchange`
  }

  // Logout
  async authLogout () {



    let cfg = {
      method: 'get',
      url: this.authLogoutEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authLogoutEndpoint () {
    return `/auth/logout`
  }

  // Login user
  async authInternalLogin () {
    const {email, password, } = arguments[0] || {}
    if (!email) {
      console.error('authInternalLogin failed, field email is empty', arguments) // log error so we can debug/trace it
      throw Error('field email is empty')
    }
    if (!password) {
      console.error('authInternalLogin failed, field password is empty', arguments) // log error so we can debug/trace it
      throw Error('field password is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalLoginEndpoint({  }),
    }

    cfg.data = {
      email,
      password,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalLoginEndpoint () {
    return `/auth/internal/login`
  }

  // User signup/registration
  async authInternalSignup () {
    const {email, username, password, handle, name, } = arguments[0] || {}
    if (!email) {
      console.error('authInternalSignup failed, field email is empty', arguments) // log error so we can debug/trace it
      throw Error('field email is empty')
    }
    if (!password) {
      console.error('authInternalSignup failed, field password is empty', arguments) // log error so we can debug/trace it
      throw Error('field password is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalSignupEndpoint({  }),
    }

    cfg.data = {
      email,
      username,
      password,
      handle,
      name,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalSignupEndpoint () {
    return `/auth/internal/signup`
  }

  // Request password reset token (via email)
  async authInternalRequestPasswordReset () {
    const {email, } = arguments[0] || {}
    if (!email) {
      console.error('authInternalRequestPasswordReset failed, field email is empty', arguments) // log error so we can debug/trace it
      throw Error('field email is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalRequestPasswordResetEndpoint({  }),
    }

    cfg.data = {
      email,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalRequestPasswordResetEndpoint () {
    return `/auth/internal/request-password-reset`
  }

  // Exchange password reset token for new token and user info
  async authInternalExchangePasswordResetToken () {
    const {token, } = arguments[0] || {}
    if (!token) {
      console.error('authInternalExchangePasswordResetToken failed, field token is empty', arguments) // log error so we can debug/trace it
      throw Error('field token is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalExchangePasswordResetTokenEndpoint({  }),
    }

    cfg.data = {
      token,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalExchangePasswordResetTokenEndpoint () {
    return `/auth/internal/exchange-password-reset-token`
  }

  // Reset password with exchanged password reset token
  async authInternalResetPassword () {
    const {token, password, } = arguments[0] || {}
    if (!token) {
      console.error('authInternalResetPassword failed, field token is empty', arguments) // log error so we can debug/trace it
      throw Error('field token is empty')
    }
    if (!password) {
      console.error('authInternalResetPassword failed, field password is empty', arguments) // log error so we can debug/trace it
      throw Error('field password is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalResetPasswordEndpoint({  }),
    }

    cfg.data = {
      token,
      password,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalResetPasswordEndpoint () {
    return `/auth/internal/reset-password`
  }

  // Confirm email with token
  async authInternalConfirmEmail () {
    const {token, } = arguments[0] || {}
    if (!token) {
      console.error('authInternalConfirmEmail failed, field token is empty', arguments) // log error so we can debug/trace it
      throw Error('field token is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalConfirmEmailEndpoint({  }),
    }

    cfg.data = {
      token,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalConfirmEmailEndpoint () {
    return `/auth/internal/confirm-email`
  }

  // Changes password for current user, requires current password
  async authInternalChangePassword () {
    const {oldPassword, newPassword, } = arguments[0] || {}
    if (!oldPassword) {
      console.error('authInternalChangePassword failed, field oldPassword is empty', arguments) // log error so we can debug/trace it
      throw Error('field oldPassword is empty')
    }
    if (!newPassword) {
      console.error('authInternalChangePassword failed, field newPassword is empty', arguments) // log error so we can debug/trace it
      throw Error('field newPassword is empty')
    }

    let cfg = {
      method: 'post',
      url: this.authInternalChangePasswordEndpoint({  }),
    }

    cfg.data = {
      oldPassword,
      newPassword,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  authInternalChangePasswordEndpoint () {
    return `/auth/internal/change-password`
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

  // Returns current subscription status
  async subscriptionCurrent () {



    let cfg = {
      method: 'get',
      url: this.subscriptionCurrentEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  subscriptionCurrentEndpoint () {
    return `/subscription/`
  }

  // List organisations
  async organisationList () {
    const {query, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.organisationListEndpoint({  }),
    }
    cfg.params = {
      query,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  organisationListEndpoint () {
    return `/organisations/`
  }

  // Create organisation
  async organisationCreate () {
    const {name, } = arguments[0] || {}
    if (!name) {
      console.error('organisationCreate failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }

    let cfg = {
      method: 'post',
      url: this.organisationCreateEndpoint({  }),
    }

    cfg.data = {
      name,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  organisationCreateEndpoint () {
    return `/organisations/`
  }

  // Update organisation details
  async organisationUpdate () {
    const {id, name, } = arguments[0] || {}
    if (!name) {
      console.error('organisationUpdate failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }

    let cfg = {
      method: 'put',
      url: this.organisationUpdateEndpoint({
        id,
      }),
    }

    cfg.data = {
      name,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  organisationUpdateEndpoint ({id, } = {}) {
    return `/organisations/${id}`
  }

  // Remove organisation
  async organisationDelete () {
    const {id, } = arguments[0] || {}
    if (!id) {
      console.error('organisationDelete failed, field id is empty', arguments) // log error so we can debug/trace it
      throw Error('field id is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.organisationDeleteEndpoint({
        id,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  organisationDeleteEndpoint ({id, } = {}) {
    return `/organisations/${id}`
  }

  // Read organisation details
  async organisationRead () {
    const {id, } = arguments[0] || {}
    if (!id) {
      console.error('organisationRead failed, field id is empty', arguments) // log error so we can debug/trace it
      throw Error('field id is empty')
    }

    let cfg = {
      method: 'get',
      url: this.organisationReadEndpoint({  }),
    }
    cfg.params = {
      id,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  organisationReadEndpoint () {
    return `/organisations/${id}`
  }

  // Archive organisation
  async organisationArchive () {
    const {id, } = arguments[0] || {}
    if (!id) {
      console.error('organisationArchive failed, field id is empty', arguments) // log error so we can debug/trace it
      throw Error('field id is empty')
    }

    let cfg = {
      method: 'post',
      url: this.organisationArchiveEndpoint({
        id,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  organisationArchiveEndpoint ({id, } = {}) {
    return `/organisations/${id}/archive`
  }

  // List roles
  async roleList () {
    const {query, deleted, archived, page, perPage, sort, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.roleListEndpoint({  }),
    }
    cfg.params = {
      query,
      deleted,
      archived,
      page,
      perPage,
      sort,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleListEndpoint () {
    return `/roles/`
  }

  // Update role details
  async roleCreate () {
    const {name, handle, members, } = arguments[0] || {}
    if (!name) {
      console.error('roleCreate failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }
    if (!handle) {
      console.error('roleCreate failed, field handle is empty', arguments) // log error so we can debug/trace it
      throw Error('field handle is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleCreateEndpoint({  }),
    }

    cfg.data = {
      name,
      handle,
      members,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleCreateEndpoint () {
    return `/roles/`
  }

  // Update role details
  async roleUpdate () {
    const {roleID, name, handle, members, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleUpdate failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
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
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleUpdateEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}`
  }

  // Read role details and memberships
  async roleRead () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleRead failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.roleReadEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleReadEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}`
  }

  // Remove role
  async roleDelete () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleDelete failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.roleDeleteEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleDeleteEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}`
  }

  // Archive role
  async roleArchive () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleArchive failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleArchiveEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleArchiveEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/archive`
  }

  // Unarchive role
  async roleUnarchive () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleUnarchive failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleUnarchiveEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleUnarchiveEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/unarchive`
  }

  // Undelete role
  async roleUndelete () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleUndelete failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleUndeleteEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleUndeleteEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/undelete`
  }

  // Move role to different organisation
  async roleMove () {
    const {roleID, organisationID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleMove failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!organisationID) {
      console.error('roleMove failed, field organisationID is empty', arguments) // log error so we can debug/trace it
      throw Error('field organisationID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleMoveEndpoint({
        roleID,
      }),
    }

    cfg.data = {
      organisationID,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleMoveEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/move`
  }

  // Merge one role into another
  async roleMerge () {
    const {roleID, destination, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleMerge failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!destination) {
      console.error('roleMerge failed, field destination is empty', arguments) // log error so we can debug/trace it
      throw Error('field destination is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleMergeEndpoint({
        roleID,
      }),
    }

    cfg.data = {
      destination,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleMergeEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/merge`
  }

  // Returns all role members
  async roleMemberList () {
    const {roleID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleMemberList failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.roleMemberListEndpoint({
        roleID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleMemberListEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/members`
  }

  // Add member to a role
  async roleMemberAdd () {
    const {roleID, userID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleMemberAdd failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!userID) {
      console.error('roleMemberAdd failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleMemberAddEndpoint({
        roleID,
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleMemberAddEndpoint ({roleID, userID, } = {}) {
    return `/roles/${roleID}/member/${userID}`
  }

  // Remove member from a role
  async roleMemberRemove () {
    const {roleID, userID, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleMemberRemove failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!userID) {
      console.error('roleMemberRemove failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.roleMemberRemoveEndpoint({
        roleID,
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleMemberRemoveEndpoint ({roleID, userID, } = {}) {
    return `/roles/${roleID}/member/${userID}`
  }

  // Fire system:role trigger
  async roleTriggerScript () {
    const {roleID, script, } = arguments[0] || {}
    if (!roleID) {
      console.error('roleTriggerScript failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!script) {
      console.error('roleTriggerScript failed, field script is empty', arguments) // log error so we can debug/trace it
      throw Error('field script is empty')
    }

    let cfg = {
      method: 'post',
      url: this.roleTriggerScriptEndpoint({
        roleID,
      }),
    }

    cfg.data = {
      script,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  roleTriggerScriptEndpoint ({roleID, } = {}) {
    return `/roles/${roleID}/trigger`
  }

  // Search users (Directory)
  async userList () {
    const {userID, roleID, query, username, email, handle, kind, incDeleted, incSuspended, deleted, suspended, sort, page, perPage, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.userListEndpoint({  }),
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
      sort,
      page,
      perPage,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userListEndpoint () {
    return `/users/`
  }

  // Create user
  async userCreate () {
    const {email, name, handle, kind, } = arguments[0] || {}
    if (!email) {
      console.error('userCreate failed, field email is empty', arguments) // log error so we can debug/trace it
      throw Error('field email is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userCreateEndpoint({  }),
    }

    cfg.data = {
      email,
      name,
      handle,
      kind,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userCreateEndpoint () {
    return `/users/`
  }

  // Update user details
  async userUpdate () {
    const {userID, email, name, handle, kind, } = arguments[0] || {}
    if (!userID) {
      console.error('userUpdate failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }
    if (!email) {
      console.error('userUpdate failed, field email is empty', arguments) // log error so we can debug/trace it
      throw Error('field email is empty')
    }
    if (!name) {
      console.error('userUpdate failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }

    let cfg = {
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
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userUpdateEndpoint ({userID, } = {}) {
    return `/users/${userID}`
  }

  // Read user details
  async userRead () {
    const {userID, } = arguments[0] || {}
    if (!userID) {
      console.error('userRead failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.userReadEndpoint({
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userReadEndpoint ({userID, } = {}) {
    return `/users/${userID}`
  }

  // Remove user
  async userDelete () {
    const {userID, } = arguments[0] || {}
    if (!userID) {
      console.error('userDelete failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.userDeleteEndpoint({
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userDeleteEndpoint ({userID, } = {}) {
    return `/users/${userID}`
  }

  // Suspend user
  async userSuspend () {
    const {userID, } = arguments[0] || {}
    if (!userID) {
      console.error('userSuspend failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userSuspendEndpoint({
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userSuspendEndpoint ({userID, } = {}) {
    return `/users/${userID}/suspend`
  }

  // Unsuspend user
  async userUnsuspend () {
    const {userID, } = arguments[0] || {}
    if (!userID) {
      console.error('userUnsuspend failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userUnsuspendEndpoint({
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userUnsuspendEndpoint ({userID, } = {}) {
    return `/users/${userID}/unsuspend`
  }

  // Undelete user
  async userUndelete () {
    const {userID, } = arguments[0] || {}
    if (!userID) {
      console.error('userUndelete failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userUndeleteEndpoint({
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userUndeleteEndpoint ({userID, } = {}) {
    return `/users/${userID}/undelete`
  }

  // Set&#x27;s or changes user&#x27;s password
  async userSetPassword () {
    const {userID, password, } = arguments[0] || {}
    if (!userID) {
      console.error('userSetPassword failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }
    if (!password) {
      console.error('userSetPassword failed, field password is empty', arguments) // log error so we can debug/trace it
      throw Error('field password is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userSetPasswordEndpoint({
        userID,
      }),
    }

    cfg.data = {
      password,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userSetPasswordEndpoint ({userID, } = {}) {
    return `/users/${userID}/password`
  }

  // Add member to a role
  async userMembershipList () {
    const {userID, } = arguments[0] || {}
    if (!userID) {
      console.error('userMembershipList failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.userMembershipListEndpoint({
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userMembershipListEndpoint ({userID, } = {}) {
    return `/users/${userID}/membership`
  }

  // Add role to a user
  async userMembershipAdd () {
    const {roleID, userID, } = arguments[0] || {}
    if (!roleID) {
      console.error('userMembershipAdd failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!userID) {
      console.error('userMembershipAdd failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userMembershipAddEndpoint({
        roleID,
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userMembershipAddEndpoint ({roleID, userID, } = {}) {
    return `/users/${userID}/membership/${roleID}`
  }

  // Remove role from a user
  async userMembershipRemove () {
    const {roleID, userID, } = arguments[0] || {}
    if (!roleID) {
      console.error('userMembershipRemove failed, field roleID is empty', arguments) // log error so we can debug/trace it
      throw Error('field roleID is empty')
    }
    if (!userID) {
      console.error('userMembershipRemove failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.userMembershipRemoveEndpoint({
        roleID,
        userID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userMembershipRemoveEndpoint ({roleID, userID, } = {}) {
    return `/users/${userID}/membership/${roleID}`
  }

  // Fire system:user trigger
  async userTriggerScript () {
    const {userID, script, } = arguments[0] || {}
    if (!userID) {
      console.error('userTriggerScript failed, field userID is empty', arguments) // log error so we can debug/trace it
      throw Error('field userID is empty')
    }
    if (!script) {
      console.error('userTriggerScript failed, field script is empty', arguments) // log error so we can debug/trace it
      throw Error('field script is empty')
    }

    let cfg = {
      method: 'post',
      url: this.userTriggerScriptEndpoint({
        userID,
      }),
    }

    cfg.data = {
      script,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  userTriggerScriptEndpoint ({userID, } = {}) {
    return `/users/${userID}/trigger`
  }

  // List applications
  async applicationList () {
    const {name, query, deleted, page, perPage, sort, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.applicationListEndpoint({  }),
    }
    cfg.params = {
      name,
      query,
      deleted,
      page,
      perPage,
      sort,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationListEndpoint () {
    return `/application/`
  }

  // Create application
  async applicationCreate () {
    const {name, enabled, unify, config, } = arguments[0] || {}
    if (!name) {
      console.error('applicationCreate failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }

    let cfg = {
      method: 'post',
      url: this.applicationCreateEndpoint({  }),
    }

    cfg.data = {
      name,
      enabled,
      unify,
      config,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationCreateEndpoint () {
    return `/application/`
  }

  // Update user details
  async applicationUpdate () {
    const {applicationID, name, enabled, unify, config, } = arguments[0] || {}
    if (!applicationID) {
      console.error('applicationUpdate failed, field applicationID is empty', arguments) // log error so we can debug/trace it
      throw Error('field applicationID is empty')
    }
    if (!name) {
      console.error('applicationUpdate failed, field name is empty', arguments) // log error so we can debug/trace it
      throw Error('field name is empty')
    }

    let cfg = {
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
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationUpdateEndpoint ({applicationID, } = {}) {
    return `/application/${applicationID}`
  }

  // Read application details
  async applicationRead () {
    const {applicationID, } = arguments[0] || {}
    if (!applicationID) {
      console.error('applicationRead failed, field applicationID is empty', arguments) // log error so we can debug/trace it
      throw Error('field applicationID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.applicationReadEndpoint({
        applicationID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationReadEndpoint ({applicationID, } = {}) {
    return `/application/${applicationID}`
  }

  // Remove application
  async applicationDelete () {
    const {applicationID, } = arguments[0] || {}
    if (!applicationID) {
      console.error('applicationDelete failed, field applicationID is empty', arguments) // log error so we can debug/trace it
      throw Error('field applicationID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.applicationDeleteEndpoint({
        applicationID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationDeleteEndpoint ({applicationID, } = {}) {
    return `/application/${applicationID}`
  }

  // Undelete application
  async applicationUndelete () {
    const {applicationID, } = arguments[0] || {}
    if (!applicationID) {
      console.error('applicationUndelete failed, field applicationID is empty', arguments) // log error so we can debug/trace it
      throw Error('field applicationID is empty')
    }

    let cfg = {
      method: 'post',
      url: this.applicationUndeleteEndpoint({
        applicationID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationUndeleteEndpoint ({applicationID, } = {}) {
    return `/application/${applicationID}/undelete`
  }

  // Fire system:application trigger
  async applicationTriggerScript () {
    const {applicationID, script, } = arguments[0] || {}
    if (!applicationID) {
      console.error('applicationTriggerScript failed, field applicationID is empty', arguments) // log error so we can debug/trace it
      throw Error('field applicationID is empty')
    }
    if (!script) {
      console.error('applicationTriggerScript failed, field script is empty', arguments) // log error so we can debug/trace it
      throw Error('field script is empty')
    }

    let cfg = {
      method: 'post',
      url: this.applicationTriggerScriptEndpoint({
        applicationID,
      }),
    }

    cfg.data = {
      script,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  applicationTriggerScriptEndpoint ({applicationID, } = {}) {
    return `/application/${applicationID}/trigger`
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

  // List/read reminders
  async reminderList () {
    const {reminderID, resource, assignedTo, scheduledFrom, scheduledUntil, scheduledOnly, excludeDismissed, page, perPage, sort, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.reminderListEndpoint({  }),
    }
    cfg.params = {
      reminderID,
      resource,
      assignedTo,
      scheduledFrom,
      scheduledUntil,
      scheduledOnly,
      excludeDismissed,
      page,
      perPage,
      sort,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderListEndpoint () {
    return `/reminder/`
  }

  // Add new reminder
  async reminderCreate () {
    const {resource, assignedTo, payload, remindAt, } = arguments[0] || {}
    if (!resource) {
      console.error('reminderCreate failed, field resource is empty', arguments) // log error so we can debug/trace it
      throw Error('field resource is empty')
    }
    if (!assignedTo) {
      console.error('reminderCreate failed, field assignedTo is empty', arguments) // log error so we can debug/trace it
      throw Error('field assignedTo is empty')
    }
    if (!payload) {
      console.error('reminderCreate failed, field payload is empty', arguments) // log error so we can debug/trace it
      throw Error('field payload is empty')
    }

    let cfg = {
      method: 'post',
      url: this.reminderCreateEndpoint({  }),
    }

    cfg.data = {
      resource,
      assignedTo,
      payload,
      remindAt,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderCreateEndpoint () {
    return `/reminder/`
  }

  // Update reminder
  async reminderUpdate () {
    const {reminderID, resource, assignedTo, payload, remindAt, } = arguments[0] || {}
    if (!reminderID) {
      console.error('reminderUpdate failed, field reminderID is empty', arguments) // log error so we can debug/trace it
      throw Error('field reminderID is empty')
    }
    if (!resource) {
      console.error('reminderUpdate failed, field resource is empty', arguments) // log error so we can debug/trace it
      throw Error('field resource is empty')
    }
    if (!assignedTo) {
      console.error('reminderUpdate failed, field assignedTo is empty', arguments) // log error so we can debug/trace it
      throw Error('field assignedTo is empty')
    }
    if (!payload) {
      console.error('reminderUpdate failed, field payload is empty', arguments) // log error so we can debug/trace it
      throw Error('field payload is empty')
    }

    let cfg = {
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
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderUpdateEndpoint ({reminderID, } = {}) {
    return `/reminder/${reminderID}`
  }

  // Read reminder by ID
  async reminderRead () {
    const {reminderID, } = arguments[0] || {}
    if (!reminderID) {
      console.error('reminderRead failed, field reminderID is empty', arguments) // log error so we can debug/trace it
      throw Error('field reminderID is empty')
    }

    let cfg = {
      method: 'get',
      url: this.reminderReadEndpoint({
        reminderID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderReadEndpoint ({reminderID, } = {}) {
    return `/reminder/${reminderID}`
  }

  // Delete reminder
  async reminderDelete () {
    const {reminderID, } = arguments[0] || {}
    if (!reminderID) {
      console.error('reminderDelete failed, field reminderID is empty', arguments) // log error so we can debug/trace it
      throw Error('field reminderID is empty')
    }

    let cfg = {
      method: 'delete',
      url: this.reminderDeleteEndpoint({
        reminderID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderDeleteEndpoint ({reminderID, } = {}) {
    return `/reminder/${reminderID}`
  }

  // Dismiss reminder
  async reminderDismiss () {
    const {reminderID, } = arguments[0] || {}
    if (!reminderID) {
      console.error('reminderDismiss failed, field reminderID is empty', arguments) // log error so we can debug/trace it
      throw Error('field reminderID is empty')
    }

    let cfg = {
      method: 'patch',
      url: this.reminderDismissEndpoint({
        reminderID,
      }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderDismissEndpoint ({reminderID, } = {}) {
    return `/reminder/${reminderID}/dismiss`
  }

  // Snooze reminder
  async reminderSnooze () {
    const {reminderID, remindAt, } = arguments[0] || {}
    if (!reminderID) {
      console.error('reminderSnooze failed, field reminderID is empty', arguments) // log error so we can debug/trace it
      throw Error('field reminderID is empty')
    }
    if (!remindAt) {
      console.error('reminderSnooze failed, field remindAt is empty', arguments) // log error so we can debug/trace it
      throw Error('field remindAt is empty')
    }

    let cfg = {
      method: 'patch',
      url: this.reminderSnoozeEndpoint({
        reminderID,
      }),
    }

    cfg.data = {
      remindAt,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  reminderSnoozeEndpoint ({reminderID, } = {}) {
    return `/reminder/${reminderID}/snooze`
  }

  // List system statistics
  async statsList () {



    let cfg = {
      method: 'get',
      url: this.statsListEndpoint({  }),
    }


    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  statsListEndpoint () {
    return `/stats/`
  }

  // List all available automation scripts for system resources
  async automationList () {
    const {resourceTypes, eventTypes, excludeClientScripts, excludeServerScripts, } = arguments[0] || {}


    let cfg = {
      method: 'get',
      url: this.automationListEndpoint({  }),
    }
    cfg.params = {
      resourceTypes,
      eventTypes,
      excludeClientScripts,
      excludeServerScripts,
    }

    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  automationListEndpoint () {
    return `/automation/`
  }

  // Triggers execution of a specific script on a system service level
  async automationTriggerScript () {
    const {script, } = arguments[0] || {}
    if (!script) {
      console.error('automationTriggerScript failed, field script is empty', arguments) // log error so we can debug/trace it
      throw Error('field script is empty')
    }

    let cfg = {
      method: 'post',
      url: this.automationTriggerScriptEndpoint({  }),
    }

    cfg.data = {
      script,
    }
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  automationTriggerScriptEndpoint () {
    return `/automation/trigger`
  }

}
