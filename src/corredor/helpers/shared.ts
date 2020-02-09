/* eslint-disable */
import { NoID } from '../../cast'
import { Compose, Messaging, System } from '../../api-clients'

export interface Rule {
  role: {
    roleID: string;
  };
}

export interface Permissions {
  [key: string]: Rule[];
}

interface  PermissionUpdater {
  permissionsUpdate({ roleID, rules }: { roleID: string, rules: Array<object>}): void;
}

/**
 * Extracts ID-like (numeric) value from string or object
 *
 * @ignore
 * @param {string|Object} value
 * @param key
 * @returns {*}
 */
export function extractID (value: any, key: string): string {
  if (typeof value === 'object') {
    value = value[key]
  }

  if (!value || Array.isArray(value)) {
    return NoID
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value !== 'string') {
    throw Error(`unexpected value type for ${key} type (got '${value}', expecting string)`)
  }

  if (!/^[0-9]+$/.test(value)) {
    throw Error(`unexpected value format for ${key} type (got '${value}', expecting digits)`)
  }

  return value
}

export function isFresh (ID: string): boolean {
  return !ID || ID === NoID
}

export function genericPermissionUpdater (API: PermissionUpdater, rules: Rule[]) {
  const g:Permissions = rules.reduce((acc: Permissions, p: Rule) => {
    if (!acc[p.role.roleID]) {
      acc[p.role.roleID] = []
    }

    acc[p.role.roleID].push(p)
    return acc
  }, {})

  Object.keys(g).forEach(async roleID => {
    // permissions grouped per role
    await API.permissionsUpdate({ roleID, rules: g[roleID] })
  })
}
