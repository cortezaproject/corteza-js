import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'

interface KV {
  [_: string]: unknown;
}

interface RawReminder {
  reminderID?: string;
  resource?: string;
  payload?: object;
  snoozeCount?: number;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string|number|Date;
  dismissedBy?: string;
  dismissedAt?: string|number|Date;
  remindAt?: string|number|Date;
  createdAt?: string|number|Date;
  processed?: boolean;
  actions?: object;
  options?: object;
}

export class Reminder {
  public reminderID = NoID
  public resource = NoID
  public payload: KV = {}
  public snoozeCount = 0
  public assignedTo = NoID
  public assignedBy = NoID
  public assignedAt?: Date = undefined
  public dismissedBy = NoID
  public dismissedAt?: Date = undefined
  public remindAt?: Date = undefined
  public createdAt?: Date = undefined
  public processed = false
  public actions: KV = {}
  public options: KV = {}

  constructor (r?: RawReminder | Reminder) {
    this.apply(r)
  }

  apply (r?: RawReminder | Reminder): void {
    if (!r) return

    Apply(this, r, CortezaID, 'reminderID')
    Apply(this, r, Number, 'snoozeCount')
    Apply(this, r, CortezaID, 'assignedTo', 'assignedBy', 'dismissedBy')

    // @todo actions, options, payload... all 3?
    if (r.payload) Object.assign(this.payload, r.payload)
    if (r.actions) Object.assign(this.actions, r.actions)
    if (r.options) Object.assign(this.options, r.options)

    Apply(this, r, ISO8601Date, 'assignedAt', 'dismissedAt', 'remindAt', 'createdAt')
    Apply(this, r, Boolean, 'processed')
  }
}
