/** The saved game, and migrations for older saves. Plain module, no UI. */
import { HappinessState } from '../core/happiness';
import { History } from '../core/progress';

export interface Profile {
  /** The player's own name (used in greetings). May be empty for older saves. */
  playerName: string;
  birthYear: number;
  createdAt: string;
}

export interface Persisted {
  version: 1;
  profile: Profile | null;
  history: History;
  happiness: HappinessState;
}

/**
 * Older saves named the noggin (profile.nogginName). Players now give their
 * own name instead; that old value was the noggin's name, so it isn't reused
 * as the player's name.
 */
export function migrate(d: Persisted): Persisted {
  if (!d.profile) return d;
  const p = d.profile as Profile & { nogginName?: string };
  if (typeof p.playerName === 'string') return d;
  const { nogginName: _old, ...rest } = p;
  return { ...d, profile: { ...rest, playerName: '' } };
}
