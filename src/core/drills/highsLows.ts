/**
 * Highs and Lows (working name; High Number in design.md).
 * Each screen shows five numbers in deliberately mismatched sizes. The
 * instruction switches between "tap the highest" and "tap the lowest".
 * One tap per screen, 20 screens, scored on seconds. The player must tap the
 * right number to advance.
 */

import { Rng, randInt, rngFor, shuffle } from '../rng';

export const HIGHS_LOWS_COUNT = 20;
export const HIGHS_LOWS_NUMBERS = 5;

export type HighLowMode = 'highest' | 'lowest';

export interface HighLowItem {
  value: number;
  /** Relative print size, 0.5 (small) to 1.25 (large). */
  size: number;
}

export interface HighLowScreen {
  mode: HighLowMode;
  items: HighLowItem[];
  /** Index into items of the right answer. */
  answerIndex: number;
}

/** Five size steps, smallest to largest. */
export const SIZE_STEPS = [0.5, 0.68, 0.86, 1.05, 1.25];

/** How often the target number is printed among the smallest (the "trick"). */
export const INCONGRUENT_RATE = 0.7;

function modes(rng: Rng, count: number): HighLowMode[] {
  // Roughly half switch, never more than 3 of the same mode in a row.
  const out: HighLowMode[] = [];
  for (let i = 0; i < count; i++) {
    let m: HighLowMode = rng() < 0.5 ? 'highest' : 'lowest';
    if (i >= 3 && out[i - 1] === out[i - 2] && out[i - 2] === out[i - 3]) {
      m = out[i - 1] === 'highest' ? 'lowest' : 'highest';
    }
    out.push(m);
  }
  return out;
}

function makeScreen(rng: Rng, mode: HighLowMode): HighLowScreen {
  // Five distinct values from 1..9: single digits keep it about reading the number.
  const values = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, HIGHS_LOWS_NUMBERS);
  const target = mode === 'highest' ? Math.max(...values) : Math.min(...values);

  // Assign sizes. Incongruent screens print the target small and its rivals big.
  const incongruent = rng() < INCONGRUENT_RATE;
  const byValue = values.slice().sort((x, y) => x - y);
  const sizeFor = new Map<number, number>();
  if (incongruent) {
    // Size runs against the value in the direction that misleads.
    byValue.forEach((v, rank) => {
      const step = mode === 'highest' ? SIZE_STEPS.length - 1 - rank : rank;
      sizeFor.set(v, SIZE_STEPS[step]);
    });
    // Loosen the pattern a little so it isn't a perfect inverse every time.
    const others = values.filter((v) => v !== target);
    const [x, y] = shuffle(rng, others).slice(0, 2);
    const sx = sizeFor.get(x)!;
    sizeFor.set(x, sizeFor.get(y)!);
    sizeFor.set(y, sx);
    sizeFor.set(target, SIZE_STEPS[randInt(rng, 0, 1)]);
  } else {
    const steps = shuffle(rng, SIZE_STEPS);
    values.forEach((v, i) => sizeFor.set(v, steps[i]));
  }

  const items = values.map((value) => ({ value, size: sizeFor.get(value)! }));
  return { mode, items, answerIndex: items.findIndex((it) => it.value === target) };
}

export function generateHighsLows(seed: string, count = HIGHS_LOWS_COUNT): HighLowScreen[] {
  const rng = rngFor('highsLows', seed);
  return modes(rng, count).map((m) => makeScreen(rng, m));
}

export function isCorrect(screen: HighLowScreen, index: number): boolean {
  return index === screen.answerIndex;
}
