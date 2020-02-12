import { CortezaID, NoID } from '../../cast'

interface KV {
  [_: string]: unknown;
}

interface PermissionUpdater {
  permissionsUpdate({ roleID, rules }: { roleID: string; rules: Array<object>}): void;
}

export interface PermissionRule {
  role: {
    roleID: string;
  };
}

export interface Permissions {
  [key: string]: PermissionRule[];
}

export function kv (a: unknown): KV { return a as KV }

export interface ListResponse<S, F> {
  set: S;
  filter: F;
}

/**
 * Extracts ID-like (numeric) value from string or object
 *
 * @param value - that stores ID in some way
 * @param prop - possible key lookup
 */
export function extractID (value?: unknown, prop?: string): string {
  if (value && typeof value === 'object') {
    if (!prop || !Object.prototype.hasOwnProperty.call(value, prop)) {
      return NoID
    }

    value = (value as {[_: string]: unknown})[prop]
  }

  return CortezaID(value)
}

export function isFresh (ID: string): boolean {
  return !ID || ID === NoID
}

export function genericPermissionUpdater (API: PermissionUpdater, rules: PermissionRule[]): void {
  const g: Permissions = rules.reduce((acc: Permissions, p: PermissionRule) => {
    if (!acc[p.role.roleID]) {
      acc[p.role.roleID] = []
    }

    acc[p.role.roleID].push(p)
    return acc
  }, {})

  // @todo should return promise and stack all these into Promise.all()
  Object.keys(g).forEach(async roleID => {
    // permissions grouped per role
    await API.permissionsUpdate({ roleID, rules: g[roleID] })
  })
}
