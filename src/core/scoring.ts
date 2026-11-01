/**
 * Scoring (docs/design.md section 4).
 *
 * Decided:
 *   drill score  = 50 + 10 per standard deviation better than the drill average
 *   Noggin Score = the average of the day's drill scores
 *
 * Proposed (off by default, flip TIME_SCALE to try it): compare log time for
 * timed drills, since times are skewed by slow outliers.
 */

import { Norm } from './norms';

export const SCORE_MEAN = 50;
export const POINTS_PER_SD = 10;
/** Never show the player a negative number. */
export const SCORE_FLOOR = 0;

export type TimeScale = 'linear' | 'log';
export const TIME_SCALE: TimeScale = 'linear';

/** Standard deviations better than average (positive = better). */
export function zScore(raw: number, norm: Norm, timeScale: TimeScale = TIME_SCALE): number {
  if (norm.metric === 'seconds' && timeScale === 'log') {
    // Treat times as log-normal with the given mean and SD.
    const sigma = Math.sqrt(Math.log(1 + (norm.sd / norm.mean) ** 2));
    const mu = Math.log(norm.mean) - (sigma * sigma) / 2;
    const z = (Math.log(Math.max(raw, 0.001)) - mu) / sigma;
    return norm.higherIsBetter ? z : -z;
  }
  const z = (raw - norm.mean) / norm.sd;
  return norm.higherIsBetter ? z : -z;
}

/** Unrounded drill score; useful for averaging without double rounding. */
export function drillScoreExact(raw: number, norm: Norm, timeScale: TimeScale = TIME_SCALE): number {
  return Math.max(SCORE_FLOOR, SCORE_MEAN + POINTS_PER_SD * zScore(raw, norm, timeScale));
}

/** Whole number drill score as shown to the player. */
export function drillScore(raw: number, norm: Norm, timeScale: TimeScale = TIME_SCALE): number {
  return Math.round(drillScoreExact(raw, norm, timeScale));
}

/** Noggin Score: average of the day's drill scores, rounded. */
export function nogginScore(drillScores: readonly number[]): number {
  if (drillScores.length === 0) throw new Error('nogginScore needs at least one drill score');
  const avg = drillScores.reduce((a, b) => a + b, 0) / drillScores.length;
  return Math.max(SCORE_FLOOR, Math.round(avg));
}
