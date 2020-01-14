const ServiceResourceTest = /^[a-z]+$/
const ResourceTypeTest = /^[a-z]+(:[a-z]+)+$/
const AnyResourceTest = /^[a-z]+(:[a-z]+)*(:\*)$/
const SpecResourceTest = /^[a-z]+(:[a-z]+)*(:[0-9]+)$/

export enum Access {
  INHERIT = 'inherit',
  DENY = 'deny',
  ALLOW = 'allow',
}

interface Role {
  roleID: string;
}

interface Resource {
  resourceID: string;
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
        : resource.resourceID

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
export function AnyOf (spc: string|Resource): Resource {
  const resourceID =
      typeof spc === 'string'
        ? spc
        : spc.resourceID

  switch (true) {
    case ServiceResourceTest.test(resourceID):
    case AnyResourceTest.test(resourceID):
      // Do not convert service & wildcard resources
      return { resourceID }

    case ResourceTypeTest.test(resourceID):
      return { resourceID: `${resourceID}:*` }

    case SpecResourceTest.test(resourceID):
    default:
      return { resourceID: `${resourceID.substring(0, resourceID.lastIndexOf(':'))}:*` }
  }
}
