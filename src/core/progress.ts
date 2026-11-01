/**
 * Score history and progression. One daily score test counts per day (first
 * attempt only). Everything here is phrased so the player never sees a
 * negative number: when a trend isn't up, callers get something positive to
 * show instead.
 */

import { DayKey, addDays, daysBetween, monthOf } from './day';
import { DrillId } from './norms';

export interface DrillRun {
  drillId: DrillId;
  /** Raw metric (seconds for timed drills). */
  raw: number;
  mistakes: number;
  score: number;
}

export interface DayRecord {
  day: DayKey;
  nogginScore: number;
  drills: DrillRun[];
  /** ISO timestamp of completion. */
  completedAt: string;
}

export type History = DayRecord[];

export function recordFor(history: History, day: DayKey): DayRecord | undefined {
  return history.find((r) => r.day === day);
}

export function hasTakenTest(history: History, day: DayKey): boolean {
  return recordFor(history, day) !== undefined;
}

/** Adds today's record. Only the first attempt each day counts; later ones are ignored. */
export function addRecord(history: History, record: DayRecord): History {
  if (hasTakenTest(history, record.day)) return history;
  return [...history, record].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
}

export function latestRecord(history: History, onOrBefore?: DayKey): DayRecord | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    if (!onOrBefore || history[i].day <= onOrBefore) return history[i];
  }
  return undefined;
}

/** Days with a test in the 7 days ending on `today`. */
export function daysTrainedThisWeek(history: History, today: DayKey): number {
  return history.filter((r) => {
    const d = daysBetween(r.day, today);
    return d >= 0 && d < 7;
  }).length;
}

export function daysTrainedInMonth(history: History, month: string): number {
  return history.filter((r) => monthOf(r.day) === month).length;
}

export type WeeklyTrend =
  | { kind: 'up'; delta: number }
  | { kind: 'trained'; days: number };

/**
 * The weekly trend for the home screen score note.
 * Compares the latest score with the latest score from a week or more before
 * it (or, early on, the first score this week). Shows "+N this week" only when
 * the score went up; otherwise "trained N days this week".
 */
export function weeklyTrend(history: History, today: DayKey): WeeklyTrend {
  const trained = { kind: 'trained', days: daysTrainedThisWeek(history, today) } as const;
  const latest = latestRecord(history, today);
  if (!latest) return trained;
  const weekAgo = addDays(latest.day, -7);
  let baseline = latestRecord(history, weekAgo);
  if (!baseline) {
    const earlier = history.filter((r) => r.day < latest.day);
    baseline = earlier[0];
  }
  if (!baseline) return trained;
  const delta = latest.nogginScore - baseline.nogginScore;
  return delta > 0 ? { kind: 'up', delta } : trained;
}

/** The previous score for a drill before `day`, from daily tests. */
export function lastDrillScore(history: History, drillId: DrillId, beforeDay: DayKey): number | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    const r = history[i];
    if (r.day >= beforeDay) continue;
    const run = r.drills.find((d) => d.drillId === drillId);
    if (run) return run.score;
  }
  return undefined;
}

/** Score note under a finished drill: "+3 last time" or a positive fallback. */
export function drillComparisonText(score: number, previous: number | undefined): string {
  if (previous === undefined) return 'first time!';
  const delta = score - previous;
  return delta > 0 ? `+${delta} last time` : 'nicely done';
}

export function trendText(t: WeeklyTrend): string {
  if (t.kind === 'up') return `+${t.delta} this week`;
  // Never point at an empty week; just show it as the last score.
  if (t.days === 0) return 'your last score';
  return `trained ${t.days} ${t.days === 1 ? 'day' : 'days'} this week`;
}
