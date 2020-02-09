/* eslint-disable */

import { extractID, genericPermissionUpdater, isFresh, Rule } from './shared'
import { System as SystemAPI } from '../../api-clients'
import { User, Role, Application } from '../../system/'

interface KV {
  [_: string]: unknown;
}

interface SystemContext {
  SystemAPI: SystemAPI;
  $user?: User;
  $role?: Role;
  $application?: Application;
}

interface UserFilter {
  [key: string]: string|boolean|number|undefined;
  query?: string;
  username?: string;
  handle?: string;
  email?: string;
  kind?: string;
  incDeleted?: boolean;
  incSuspended?: boolean;
  sort?: number;
  perPage?: number;
  page?: number;
}

interface UserResponse {
  filter: UserFilter;
  set: Array<User>;
}

interface RoleFilter {
  [key: string]: string|boolean|number|undefined;
  query?: string;
  deleted?: boolean;
  archived?: boolean;
  page?: number;
  perPage?: number;
  sort?: number;
}

interface RoleResponse {
  filter: RoleFilter;
  set: Array<Role>;
}

/**
 * SystemHelper provides layer over System API and utilities that simplify automation script writing
 */
export class System {
  private SystemAPI: SystemAPI;
  private $user?: User;
  private $role?: Role;
  private $application?: Application;

  constructor (ctx: SystemContext) {
    this.SystemAPI = ctx.SystemAPI

    this.$user = ctx.$user
    this.$role = ctx.$role
    this.$application = ctx.$application
  }

  /**
   * Searches for users
   *
   * @example
   * System.findUsers('some-joe').then(({ set }) => {
   *   // do something with users (User[]) in set
   * })
   *
   * @param {string|Object} filter - filter object (or filtering conditions when string)
   * @property {string} filter.query - Find %query% in email, handle, username, name...
   * @property {string} filter.username - Filter by username
   * @property {string} filter.handle - Filter by handle
   * @property {string} filter.email - Filter by email
   * @property {string} filter.kind - Filter by kind ('normal' - default, 'bot')
   * @property {boolean} filter.incDeleted - Include deleted users
   * @property {boolean} filter.incSuspended - Include suspended users
   * @property {string} filter.sort - Sort results
   * @property {number} filter.perPage - max returned records per page
   * @property {number} filter.page - page to return (1-based)
   * @returns {Promise<{filter: Object, set: User[]}>}
   */
  async findUsers (filter: string|UserFilter): Promise<UserResponse> {
    if (typeof filter === 'string') {
      filter = { query: filter }
    }

    return this.SystemAPI.userList(filter).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0 || !res.set) {
        throw new Error('user not found')
      }

      res.set = res.set.map(m => new User(m))
      return res as unknown as UserResponse
    })
  }

  /**
   * Finds user by ID
   *
   * @example
   * System.findUserByID()
   *
   * @param {string|User} user
   * @return {Promise<User>}
   */
  async findUserByID (user: string|User): Promise<User> {
    const userID = extractID(user, 'userID')
    return this.SystemAPI.userRead({ userID }).then(u => new User(u))
  }

  /**
   * Finds user by email
   *
   * @example
   * System.findUserByEmail('name@example.tld').then(user => {
   *   // do something with user
   * })
   *
   * @param {string} email
   * @return {Promise<User>}
   */
  async findUserByEmail (email: string): Promise<User> {
    return this.findUsers({ email }).then(res => {
      
      if (!Array.isArray(res.set) || res.set.length === 0) {
        return Promise.reject(new Error('user not found'))
      }

      return res.set[0]
    })
  }

  /**
   * Finds user by handle
   *
   * @example
   * System.findUserByHandle('some-handle').then(user => {
   *   // do something with user
   * })
   *
   * @param {string} handle
   * @return {Promise<User>}
   */
  async findUserByHandle (handle: string): Promise<User> {
    return this.findUsers({ handle }).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0 || !res.set) {
        return Promise.reject(new Error('user not found'))
      }

      return res.set[0]
    })
  }

  /**
   * Updates or creates user
   *
   * @example
   * System.findUserByHandle('some-handle').then(user => {
   *   user.handle = 'better-handle'
   *   return System.saveUser(user)
   * })
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  async saveUser (user: User): Promise<User> {
    return Promise.resolve(user).then(user => {
      if (isFresh(user.userID)) {
        return this.SystemAPI.userCreate(user as unknown as KV).then(user => new User(user))
      } else {
        return this.SystemAPI.userUpdate(user as unknown as KV).then(user => new User(user))
      }
    })
  }

  /**
   * Sets/updates password for the user
   *
   * @example
   * System.findUserByHandle('some-handle').then(user => {
   *   user.handle = 'better-handle'
   *   return System.saveUser(user)
   * })
   *
   * @param {string} password
   * @param {User} user
   * @returns {Promise<User>}
   */
  async setPassword (password: string, user: User = this.$user!): Promise<unknown> {
    return this.resolveUser(user).then(user => {
      const { userID } = user
      if (isFresh(userID)) {
        return Promise.reject(new Error('Cannot set password for non existing user'))
      }

      return this.SystemAPI.userSetPassword({ password, userID })
    })
  }

  /**
   * Deletes user
   *
   * @example
   * System.findUserByHandle('soon-to-be-deleted').then(user => {
   *   return System.deleteUser(user)
   * })
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  async deleteUser (user: string|User): Promise<unknown> {
    return Promise.resolve(user).then(user => {
      const userID = extractID(user, 'userID')

      if (!isFresh(userID)) {
        return this.SystemAPI.userDelete({ userID })
      }
    })
  }

  /**
   * Searches for roles
   *
   * @param filter
   * @returns {Promise<{filter: Object, set: Role[]}>}
   */
  async findRoles (filter: string|RoleFilter): Promise<RoleResponse> {
    if (typeof filter === 'string') {
      filter = { query: filter }
    }

    return this.SystemAPI.roleList(filter).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0) {
        return Promise.reject(new Error('roles not found'))
      }

      res.set = res.set.map(m => new Role(m))
      return res as unknown as RoleResponse
    })
  }

  /**
   * Finds user by ID
   *
   * @param {string|Role} role
   * @return {Promise<Role>}
   */
  async findRoleByID (role: string|Role): Promise<Role> {
    const roleID = extractID(role, 'roleID')
    return this.SystemAPI.roleRead({ roleID }).then(r => new Role(r))
  }

  /**
   * Finds role by handle
   *
   * @example
   * System.findRoleByHandle('some-handle').then(user => {
   *   // do something with role
   * })
   *
   * @param {string} handle
   * @return {Promise<Role>}
   */
  async findRoleByHandle (handle: string): Promise<Role> {
    return this.findRoles(handle).then(({ set, filter }) => {
      if (!Array.isArray(set) || set.length === 0 || !set) {
        return Promise.reject(new Error('role not found'))
      }

      return set[0]
    })
  }

  /**
   *
   * @param {Role} role
   * @returns {Promise<Role>}
   */
  async saveRole (role: Role): Promise<Role> {
    return Promise.resolve(role).then(role => {
      if (isFresh(role.roleID)) {
        return this.SystemAPI.roleCreate(role as unknown as KV).then(role => new Role(role))
      } else {
        return this.SystemAPI.roleUpdate(role as unknown as KV).then(role => new Role(role))
      }
    })
  }

  /**
   * Deletes a role
   *
   * @example
   * System.findUserByHandle('soon-to-be-deleted').then(user => {
   *   return System.deleteUser(user)
   * })
   *
   * @param {Role} role
   * @returns {Promise<void>}
   */
  async deleteRole (role: Role): Promise<unknown> {
    return Promise.resolve(role).then(role => {
      const roleID = extractID(role, 'roleID')

      if (!isFresh(roleID)) {
        return this.SystemAPI.roleDelete({ roleID })
      }
    })
  }

  /**
   * Assign role to user
   *
   * @example
   * addUserToRole('user-we-can-trust', 'admins')
   *
   * @param {User|string} user resolvable user input
   * @param {User|string} role resolvable role input
   * @returns {Promise<*>}
   */
  async addUserToRole (user: User|string, role: User|string): Promise<unknown> {
    let userID: string;
    let roleID: string;

    return this.resolveUser(user, this.$user).then(user => {
      userID = extractID(user, 'userID')
      return this.resolveRole(role, this.$role)
    }).then(role => {
      roleID = extractID(role, 'roleID')
      return this.SystemAPI.roleMemberAdd({ roleID, userID })
    })
  }

  /**
   * Remove role from user
   * @example
   * addUserToRole('user-we-can-trust', 'admins')
   *
   * @param {User|string} user resolvable user input
   * @param {User|string} role resolvable role input
   * @returns {Promise<*>}
   */
  async removeUserFromRole (user: User|string, role: Role|string): Promise<unknown> {
    let userID: string;
    let roleID: string;

    return this.resolveUser(user, this.$user).then(user => {
      userID = extractID(user, 'userID')
      return this.resolveRole(role, this.$role)
    }).then(role => {
      roleID = extractID(role, 'roleID')
      return this.SystemAPI.roleMemberRemove({ roleID, userID })
    })
  }

  /**
   * Resolves users from the arguments and returns first valid
   *
   * Knows how to resolve from:
   *  - string that looks like an ID - find by id (fallback to find-by-handle)
   *  - string that looks like an email - find by email (fallback to find-by-handle)
   *  - string - find by handle
   *  - User object
   *  - object with userID or ownerID properties
   *
   * @param {...User|Object|string}
   * @property {string} [u.userID]
   * @property {string} [u.ownerID]
   * @returns {Promise<User>}
   */
  async resolveUser (...args: unknown[]): Promise<User> {
    for (let u of args) {
      // Resolve pending promises if any...
      u = await u

      if (!u) {
        continue
      }

      if (typeof u === 'string') {
        try {
          if (/^[0-9]+$/.test(u)) {
            // Looks like an ID, try to find it and fall back to handle
            return await this.findUserByID(u)
          } else if (u.indexOf('@') > 0) {
            return await this.findUserByEmail(u)
          }
        } catch (e) {}

        // Always fall back to handle
        return this.findUserByHandle(u)
      }
      
      if (typeof u !== 'object') {
        continue
      }
      
      if (u instanceof User) {
        // Already got what we need
        return Promise.resolve(u)
      }
      
      // Other kind of object with properties that might hold user ID
      const {
        userID,
        ownerID,
      } = u as { userID?: string, ownerID?: string}
      return this.resolveUser(userID, ownerID)
    }

    return Promise.reject(new Error('unexpected input type for user resolver'))
  }

  /**
   * Resolves users from the arguments and returns first valid
   *
   * Knows how to resolve from:
   *  - string that looks like an ID - find by id (fallback to find-by-handle)
   *  - string - find by handle
   *  - Role object
   *  - object with roleID property
   *
   * @param {...Role|Object|string}
   * @property {string} [r.roleID]
   * @returns {Promise<Role|Role>}
   */
  async resolveRole (...args: unknown[]): Promise<Role> {
    for (let r of args) {
      // Resolve pending promises if any...
      r = await r

      if (!r) {
        continue
      }

      if (typeof r === 'string') {
        if (/^[0-9]+$/.test(r)) {
          // Looks like an ID, try to find it and fall back to handle
          return this.findRoleByID(r).catch(() => this.findRoleByHandle(r as string))
        }

        return this.findRoleByHandle(r)
      }

      if (typeof r !== 'object') {
        continue
      }

      if (r instanceof Role) {
        // Already got what we need
        return r
      }

      // Other kind of object with properties that might hold role ID
      const {
        roleID,
      } = r as { roleID?: string}
      return this.resolveRole(roleID)
    }

    return Promise.reject(Error('unexpected input type for role resolver'))
  }

  /**
   * Sets permissions on system resources
   *
   * @example
   * Compose.setPermissions([
   *   // Allow someRole update permissions on someUser
   *   new AllowAccess(someRole, someUser, 'update'),
   *
   *   // Allow someRole update permissions on all users
   *   new AllowAccess(anotherRole, new WildcardResource(new User), 'update')
   * ])
   *
   * @param {Rule[]} rules
   * @returns {Promise<void>}
   */
  async setPermissions (rules: Rule[]): Promise<void> {
    return genericPermissionUpdater(this.SystemAPI, rules)
  }
}
