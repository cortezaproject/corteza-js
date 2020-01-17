interface ConstraintMatcher {
  Match(value: string): boolean;
}

interface MatchFn {
  (): boolean;
}

/**
 * Dummy event to help with testing
 */
export class Dummy {
  private resource: string
  private event: string
  private match?: MatchFn

  constructor ({ resource = '', event = '', match = undefined }) {
    this.resource = resource
    this.event = event
    this.match = match
  }

  ResourceType (): string {
    return this.resource
  };

  EventType (): string {
    return this.event
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Match (c: ConstraintMatcher): boolean {
    return this.match ? this.match() : true
  }
}

export class ManualDummy extends Dummy{
  private scriptName: string

  constructor ({ scriptName = '', ...rest }) {
    super(rest)
    this.scriptName = scriptName
  }

  ScriptName (): string {
    return this.scriptName
  }
}
