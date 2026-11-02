/**
 * Happiness: a continuous love meter (docs/design.md section 6).
 *
 * - Playing fills it; different actions fill different amounts.
 * - When it's full you get a gift and the meter drops back part way.
 * - It drains while you're away.
 * - Reunion bonus: coming back to an empty meter gives an instant boost.
 * - Mood follows engagement, never performance.
 *
 * Every number below is a pacing dial for playtesting (design.md section 13).
 */

export type HappyAction = 'dailyTest' | 'training' | 'weeklyTask';

export const FILL: Record<HappyAction, number> = {
  dailyTest: 0.35,
  training: 0.08,
  weeklyTask: 0.5,
};

/** Meter level right after a gift. Higher means more frequent gifts. */
export const LEVEL_AFTER_GIFT = 0.4;
/** Drain per day away, after the grace period. */
export const DRAIN_PER_DAY = 0.15;
/** No drain for this long after last play, so a normal daily rhythm never drains. */
export const GRACE_HOURS = 30;
/** Instant boost when returning to an empty meter. */
export const REUNION_BONUS = 0.25;
/** A new noggin's meter starts empty (design.md section 6). */
export const START_LEVEL = 0;

export interface HappinessState {
  /** 0 to 1. */
  level: number;
  /** ISO timestamp of the last time the meter was filled. */
  lastPlayedAt: string | null;
  /** ISO timestamp of the last time drain was applied. */
  settledAt: string;
  gifts: number;
}

export function initialHappiness(now: Date): HappinessState {
  return { level: START_LEVEL, lastPlayedAt: null, settledAt: now.toISOString(), gifts: 0 };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const hours = (from: string, to: Date) => (to.getTime() - new Date(from).getTime()) / 3_600_000;

/** Level after drain, without mutating. */
export function currentLevel(s: HappinessState, now: Date): number {
  if (!s.lastPlayedAt) return s.level;
  const graceEnds = new Date(new Date(s.lastPlayedAt).getTime() + GRACE_HOURS * 3_600_000);
  const from = new Date(Math.max(graceEnds.getTime(), new Date(s.settledAt).getTime()));
  const drainHours = Math.max(0, (now.getTime() - from.getTime()) / 3_600_000);
  return clamp01(s.level - (DRAIN_PER_DAY * drainHours) / 24);
}

export interface SettleResult {
  state: HappinessState;
  /** True when the player came back to an empty meter and got the reunion boost. */
  reunion: boolean;
}

/** Apply drain since last settle, and the reunion bonus if the meter hit empty. Call on app open. */
export function settle(s: HappinessState, now: Date): SettleResult {
  const level = currentLevel(s, now);
  const away = s.lastPlayedAt ? hours(s.lastPlayedAt, now) : 0;
  const reunion = s.lastPlayedAt !== null && level <= 0 && away > GRACE_HOURS;
  return {
    state: {
      ...s,
      level: reunion ? REUNION_BONUS : level,
      settledAt: now.toISOString(),
      // A reunion counts as a fresh start so the drain doesn't immediately resume.
      lastPlayedAt: reunion ? now.toISOString() : s.lastPlayedAt,
    },
    reunion,
  };
}

export interface FillResult {
  state: HappinessState;
  gift: boolean;
  /** Level before the fill (after drain), for animating. */
  from: number;
}

export function fill(s: HappinessState, action: HappyAction, now: Date): FillResult {
  const from = currentLevel(s, now);
  const raw = from + FILL[action];
  const gift = raw >= 1;
  const level = gift ? clamp01(LEVEL_AFTER_GIFT + (raw - 1)) : raw;
  return {
    state: {
      level,
      lastPlayedAt: now.toISOString(),
      settledAt: now.toISOString(),
      gifts: s.gifts + (gift ? 1 : 0),
    },
    gift,
    from,
  };
}

export interface Preview {
  from: number;
  /** Capped at 1 for drawing. */
  to: number;
  reachesGift: boolean;
}

/** The faint preview of what the next action would add. */
export function preview(s: HappinessState, action: HappyAction, now: Date): Preview {
  const from = currentLevel(s, now);
  const raw = from + FILL[action];
  return { from, to: Math.min(1, raw), reachesGift: raw >= 1 };
}
