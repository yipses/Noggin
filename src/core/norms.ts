/**
 * Placeholder norms from docs/design.md section 4. Editable constants:
 * replace with playtest data (Quick Sums and Highs and Lows first, since
 * they have no published norms). Prototype: everyone shares one curve; age
 * bands come later.
 */

export type DrillId = 'quickSums' | 'highsLows' | 'stroop' | 'connectMaze' | 'symbolMatch';

export interface Norm {
  /** What the raw number measures. */
  metric: 'seconds' | 'count';
  mean: number;
  sd: number;
  /** Seconds: lower is better. Counts: higher is better. */
  higherIsBetter: boolean;
  basis: string;
}

export const NORMS: Record<DrillId, Norm> = {
  quickSums: {
    metric: 'seconds', mean: 30, sd: 9, higherIsBetter: false,
    basis: 'Estimate, about 1.5s per problem with 4 choices (20 problems)',
  },
  stroop: {
    metric: 'seconds', mean: 24, sd: 6, higherIsBetter: false,
    basis: 'Keyboard trials take about 1 to 1.5s (20 trials)',
  },
  connectMaze: {
    metric: 'seconds', mean: 45, sd: 15, higherIsBetter: false,
    basis: 'Trail Making B ages 18 to 24 about 49s on paper; tapping is faster (25 targets)',
  },
  symbolMatch: {
    metric: 'count', mean: 48, sd: 12, higherIsBetter: true,
    basis: 'Online touch Digit Symbol median 48, ages 18 to 80 (correct in 90s)',
  },
  highsLows: {
    metric: 'seconds', mean: 24, sd: 6, higherIsBetter: false,
    basis: 'Estimate, no norms for this format (20 screens)',
  },
};
