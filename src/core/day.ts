/**
 * Day keys. The player's day ends around 4am local time, so late night play
 * counts for the right day (design.md section 3).
 */

export const DAY_ROLLOVER_HOUR = 4;

/** "YYYY-MM-DD" style key for a local calendar date. */
export type DayKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

/** The game day a moment belongs to (local time, shifted back by the rollover). */
export function dayKey(date: Date, rolloverHour = DAY_ROLLOVER_HOUR): DayKey {
  const shifted = new Date(date.getTime());
  shifted.setHours(shifted.getHours() - rolloverHour);
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`;
}

export function parseDayKey(key: DayKey): { year: number; month: number; day: number } {
  const [year, month, day] = key.split('-').map(Number);
  return { year, month, day };
}

/** Whole days from a to b (b later gives a positive number). DST safe. */
export function daysBetween(a: DayKey, b: DayKey): number {
  const pa = parseDayKey(a);
  const pb = parseDayKey(b);
  const ua = Date.UTC(pa.year, pa.month - 1, pa.day);
  const ub = Date.UTC(pb.year, pb.month - 1, pb.day);
  return Math.round((ub - ua) / 86_400_000);
}

export function addDays(key: DayKey, n: number): DayKey {
  const p = parseDayKey(key);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day + n));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** "YYYY-MM" for a day key. */
export function monthOf(key: DayKey): string {
  return key.slice(0, 7);
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthAbbrev(key: DayKey): string {
  return MONTHS[parseDayKey(key).month - 1];
}

export function monthName(key: DayKey): string {
  return MONTH_NAMES[parseDayKey(key).month - 1];
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 0 = Sunday. */
export function weekdayOf(key: DayKey): number {
  const p = parseDayKey(key);
  return new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function timeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 4 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}
