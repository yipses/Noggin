import { DrillId, NORMS } from '../norms';

export interface DrillInfo {
  id: DrillId;
  /** Working name shown to the player (placeholder until final naming). */
  name: string;
  /** Items in one run. */
  length: number;
  /** One short line for the Drills tab. */
  blurb: string;
  /** The noggin's tip on the intro screen. */
  tip: string;
  built: boolean;
}

export const DRILLS: Record<DrillId, DrillInfo> = {
  quickSums: {
    id: 'quickSums', name: 'Quick Sums', length: 20, built: true,
    blurb: '20 quick sums, tap the answer',
    tip: 'Go with your first answer!',
  },
  highsLows: {
    id: 'highsLows', name: 'Highs and Lows', length: 20, built: true,
    blurb: 'Tap the highest or the lowest number',
    tip: 'Ignore the size. Read the number!',
  },
  stroop: {
    id: 'stroop', name: 'Ink Spot', length: 20, built: false,
    blurb: 'Tap the colour of the ink', tip: '',
  },
  connectMaze: {
    id: 'connectMaze', name: 'Dot to Dot', length: 25, built: false,
    blurb: 'Tap letters and numbers in turn', tip: '',
  },
  symbolMatch: {
    id: 'symbolMatch', name: 'Secret Code', length: 0, built: false,
    blurb: 'Match symbols to numbers with a key', tip: '',
  },
};

/** The daily score test. Prototype: the two built drills. */
export const DAILY_TEST: DrillId[] = ['quickSums', 'highsLows'];

export { NORMS };
