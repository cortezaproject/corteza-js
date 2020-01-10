import { ConstraintMatcher } from './constraints'

export interface Event {
  ResourceType(): string;
  EventType(): string;
  Match(c: ConstraintMatcher): boolean;
}
