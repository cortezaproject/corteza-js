/* eslint-disable */

/**
 * Extracts ID-like (numeric) value from string or object
 *
 * @ignore
 * @param {string|Object} value
 * @param key
 * @returns {*}
 */
export function extractID (value, key) {
  if (typeof value === 'object') {
    value = value[key]
  }

  if (!value || Array.isArray(value) || typeof value === 'object') {
    return '0'
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

export function isFresh (ID) {
  return !ID || ID === '0'
}

export function genericPermissionUpdater (API, rules) {
  const g = rules.reduce((acc, p) => {
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
