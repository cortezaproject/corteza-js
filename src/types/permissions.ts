const WildcardChar = '*'
const ResourceDelimiterChar = ':'

export enum Access {
  INHERIT = 'inherit',
  DENY = 'deny',
  ALLOW = 'allow',
}

interface Role {
  roleID: string;
}

interface Resource {
  resourceID(): string;
}

interface RawRule {
  role: string;
  resource: string;
  operation: string;
  access: Access;
}

export class PermissionRule {
  readonly role: string
  readonly resource: string
  readonly operation: string
  readonly access: string

  constructor (role: Role|string, resource: Resource|string, operation: string, access = Access.INHERIT) {
    this.role =
      typeof role === 'string'
        ? role
        : role.roleID

    this.resource =
      typeof resource === 'string'
        ? resource
        : resource.resourceID()

    this.operation = operation
    this.access = access || Access.INHERIT
  }
}

export class AllowAccess extends PermissionRule {
  constructor (role: Role, resource: Resource, operation: string) {
    super(role, resource, operation, Access.ALLOW)
  }
}

export class DenyAccess extends PermissionRule {
  constructor (role: Role, resource: Resource, operation: string) {
    super(role, resource, operation, Access.DENY)
  }
}

/**
 * Converts specific resource identify to a wildcard identifier
 *
 * foo:42 => foo:*
 * foo    => foo
 */
export function AnyOf (specific: Resource): Resource {
  const resourceID = specific.resourceID()
  const pos = resourceID.lastIndexOf(ResourceDelimiterChar)

  if (pos > 0) {
    return {
      resourceID (): string {
        return resourceID.substring(0, pos) + ResourceDelimiterChar + WildcardChar
      },
    }
  } else {
    return specific
  }
}
