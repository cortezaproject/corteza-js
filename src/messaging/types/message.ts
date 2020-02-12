type PartialMessage = { [_: string]: unknown }

export class Message {
  [_: string]: unknown

  constructor (m?: PartialMessage) {
    this.apply(m)
  }

  apply (m?: PartialMessage): void {
    Object.assign(this, m)
  }
}
