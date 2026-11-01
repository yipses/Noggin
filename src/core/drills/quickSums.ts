/**
 * Quick Sums (working name; Calculations x 20 in design.md).
 * 20 arithmetic problems, 4 answer choices in a 2x2 grid, one fixed difficulty
 * so scores compare day to day. Scored on seconds; the player must tap the
 * right answer to advance, so errors cost time.
 *
 * Distractor rules (screens.md): plausible values (off by one or two, off by
 * ten, a neighbouring times table fact), and every choice ends in a different
 * digit.
 */

import { Rng, pick, randInt, rngFor, shuffle } from '../rng';

export const QUICK_SUMS_COUNT = 20;
export const QUICK_SUMS_CHOICES = 4;

export type Op = '+' | '−' | '×';

export interface SumProblem {
  a: number;
  b: number;
  op: Op;
  answer: number;
  /** Exactly 4 distinct, non-negative values, one of which is the answer. */
  choices: number[];
}

/** The printed problem, e.g. "7 × 8". The minus is a true minus sign, not a dash. */
export function problemText(p: SumProblem): string {
  return `${p.a} ${p.op} ${p.b}`;
}

function makeProblem(rng: Rng): Omit<SumProblem, 'choices'> {
  const op = pick<Op>(rng, ['+', '+', '−', '×', '×']);
  if (op === '×') {
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 2, 9);
    return { a, b, op, answer: a * b };
  }
  if (op === '+') {
    const a = randInt(rng, 3, 19);
    const b = randInt(rng, 2, 9);
    return { a, b, op, answer: a + b };
  }
  const answer = randInt(rng, 2, 15);
  const b = randInt(rng, 2, 9);
  return { a: answer + b, b, op, answer };
}

const lastDigit = (n: number) => Math.abs(n) % 10;

/** Plausible wrong answers, most plausible first. */
export function distractorCandidates(p: Omit<SumProblem, 'choices'>): number[] {
  const { a, b, op, answer } = p;
  const c: number[] = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 10, answer - 10];
  if (op === '×') {
    // Neighbouring times table facts.
    c.unshift(a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b);
  } else if (op === '+') {
    c.push(a - b, answer + 9, answer + 11);
  } else {
    c.push(a + b, answer + 9, answer + 11);
  }
  return c;
}

export function chooseChoices(rng: Rng, p: Omit<SumProblem, 'choices'>): number[] {
  const used = new Set<number>([lastDigit(p.answer)]);
  const picked: number[] = [];
  // Shuffle within the plausible pool but keep a bias toward the most plausible.
  const pool = distractorCandidates(p);
  const ordered = [...shuffle(rng, pool.slice(0, 6)), ...shuffle(rng, pool.slice(6))];
  for (const v of ordered) {
    if (picked.length === QUICK_SUMS_CHOICES - 1) break;
    if (v < 0 || v === p.answer || picked.includes(v) || used.has(lastDigit(v))) continue;
    picked.push(v);
    used.add(lastDigit(v));
  }
  // Fallback: nearby values with unused last digits.
  for (let d = 3; picked.length < QUICK_SUMS_CHOICES - 1; d++) {
    for (const v of [p.answer + d, p.answer - d]) {
      if (picked.length === QUICK_SUMS_CHOICES - 1) break;
      if (v < 0 || used.has(lastDigit(v))) continue;
      picked.push(v);
      used.add(lastDigit(v));
    }
  }
  return shuffle(rng, [p.answer, ...picked]);
}

export function generateQuickSums(seed: string, count = QUICK_SUMS_COUNT): SumProblem[] {
  const rng = rngFor('quickSums', seed);
  const out: SumProblem[] = [];
  while (out.length < count) {
    const base = makeProblem(rng);
    const prev = out[out.length - 1];
    if (prev && prev.op === base.op && prev.answer === base.answer) continue;
    out.push({ ...base, choices: chooseChoices(rng, base) });
  }
  return out;
}
