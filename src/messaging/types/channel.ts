import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { AreStrings } from '../../guards'

// @todo port fuzkeys, normalizers

interface User {
  userID: string;
}

enum Type {
  public = 'public',
  private = 'private',
  group = 'group',
}

enum MembershipPolicy {
  default = '',
  featured = 'featured',
  forced = 'forced',
}

enum MembershipFlag {
  none = '',
  pinned = 'pinned',
  hidden = 'hidden',
  ignored = 'ignored',
}

interface PartialChannel extends Partial<Omit<Channel, 'createdAt' | 'updatedAt' | 'deletedAt' | 'suspendedAt'>> {
  createdAt?: string|number|Date;
  updatedAt?: string|number|Date;
  deletedAt?: string|number|Date;
  suspendedAt?: string|number|Date;
}

export class Channel {
  public channelID = NoID
  public name = ''
  public topic = ''
  public type = Type.public
  public members: string[] = []
  public membershipFlag = MembershipFlag.none
  public membershipPolicy = MembershipPolicy.default
  public canJoin = false
  public canPart = false
  public canObserve = false
  public canSendMessages = false
  public canDeleteMessages = false
  public canChangeMembers = false
  public canChangeMembershipPolicy = false
  public canUpdate = false
  public canArchive = false
  public canDelete = false
  public createdAt?: Date = undefined
  public updatedAt?: Date = undefined
  public deletedAt?: Date = undefined
  public archivedAt?: Date = undefined

  constructor (c?: PartialChannel) {
    this.apply(c)
  }

  apply (c?: PartialChannel): void {
    Apply(this, c, CortezaID, 'channelID')

    Apply(this, c, String, 'name', 'topic')
    Apply(this, c, String, 'type', 'membershipFlag', 'membershipPolicy')

    if (c?.members) {
      this.members = []
      if (AreStrings(c.members)) {
        this.members = c.members
      }
    }

    Apply(this, c, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt', 'archivedAt')
    Apply(this, c, Boolean,
      'canJoin',
      'canPart',
      'canObserve',
      'canSendMessages',
      'canDeleteMessages',
      'canChangeMembers',
      'canChangeMembershipPolicy',
      'canUpdate',
      'canArchive',
      'canDelete',
    )
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.channelID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'messaging:channel'
  }

  get fts (): string {
    return [
      this.name,
      this.topic,
      this.channelID,
    ].join(' ').toLocaleLowerCase()
  }

  suggestionLabel (): string {
    return this.name || this.channelID || ''
  }

  isMember (userID: string): boolean {
    return this.members.indexOf(userID) !== -1
  }

  isFeatured (): boolean {
    return (this.membershipPolicy === MembershipPolicy.featured)
  }

  removeMember (user: string | User): void {
    const userID = (typeof user === 'object' ? user.userID : user)
    this.members = this.members.filter(m => m !== userID)
  }

  /**
   * Direct message channel is a unnamed channel with type=group and with exactly 2 members.
   */
  isDirectMessage (): boolean {
    return this.type === Type.group && this.name === '' && this.members.length === 2
  }

  isPinned (): boolean {
    return this.membershipFlag === MembershipFlag.pinned
  }

  isGroup (): boolean {
    return this.type === Type.group
  }

  isPrivate (): boolean {
    return this.type === Type.private
  }

  isPublic (): boolean {
    return this.type === Type.public
  }

  isValid (): boolean {
    return !this.deletedAt && !this.archivedAt
  }
}
