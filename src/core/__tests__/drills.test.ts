import { generateQuickSums, problemText } from '../drills/quickSums';
import { generateHighsLows, isCorrect } from '../drills/highsLows';
import { FORBIDDEN_DASHES } from '../copy';

const SEEDS = ['2026-11-01', '2026-11-02', '1999-01-01', 'practice', 'x'];

describe('Quick Sums', () => {
  it('makes 20 problems with 4 valid choices each', () => {
    for (const seed of SEEDS) {
      const ps = generateQuickSums(seed);
      expect(ps).toHaveLength(20);
      for (const p of ps) {
        expect(p.choices).toHaveLength(4);
        expect(p.choices).toContain(p.answer);
        expect(new Set(p.choices).size).toBe(4);
        // Every choice ends in a different digit.
        expect(new Set(p.choices.map((c) => c % 10)).size).toBe(4);
        expect(p.choices.every((c) => Number.isInteger(c) && c >= 0)).toBe(true);
        // The arithmetic is right.
        const expected = p.op === '+' ? p.a + p.b : p.op === '×' ? p.a * p.b : p.a - p.b;
        expect(p.answer).toBe(expected);
        expect(p.answer).toBeGreaterThanOrEqual(0);
        expect(problemText(p)).not.toMatch(FORBIDDEN_DASHES);
      }
    }
  });

  it('is deterministic per seed and fresh across days', () => {
    expect(generateQuickSums('2026-11-01')).toEqual(generateQuickSums('2026-11-01'));
    expect(generateQuickSums('2026-11-01')).not.toEqual(generateQuickSums('2026-11-02'));
  });

  it('distractors are plausible (mostly near the answer)', () => {
    const ps = SEEDS.flatMap((s) => generateQuickSums(s));
    let near = 0;
    let total = 0;
    for (const p of ps) {
      for (const c of p.choices) {
        if (c === p.answer) continue;
        total++;
        if (Math.abs(c - p.answer) <= 11 || (p.op === '×' && Math.abs(c - p.answer) <= 9)) near++;
      }
    }
    expect(near / total).toBeGreaterThan(0.9);
  });
});

describe('Highs and Lows', () => {
  it('makes 20 screens of 5 distinct numbers with one right answer', () => {
    for (const seed of SEEDS) {
      const screens = generateHighsLows(seed);
      expect(screens).toHaveLength(20);
      for (const s of screens) {
        const values = s.items.map((i) => i.value);
        expect(new Set(values).size).toBe(5);
        const target = s.mode === 'highest' ? Math.max(...values) : Math.min(...values);
        expect(values[s.answerIndex]).toBe(target);
        expect(isCorrect(s, s.answerIndex)).toBe(true);
        expect(s.items.every((i) => i.size >= 0.5 && i.size <= 1.25)).toBe(true);
      }
    }
  });

  it('mixes instructions and never repeats one more than 3 times in a row', () => {
    for (const seed of SEEDS) {
      const ms = generateHighsLows(seed).map((s) => s.mode);
      expect(ms).toContain('highest');
      expect(ms).toContain('lowest');
      for (let i = 3; i < ms.length; i++) {
        expect(ms[i] === ms[i - 1] && ms[i] === ms[i - 2] && ms[i] === ms[i - 3]).toBe(false);
      }
    }
  });

  it('usually prints the target small (the trick)', () => {
    const screens = SEEDS.flatMap((s) => generateHighsLows(s));
    const small = screens.filter((s) => s.items[s.answerIndex].size <= 0.68).length;
    expect(small / screens.length).toBeGreaterThan(0.5);
  });
});
