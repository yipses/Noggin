import { NORMS } from '../norms';
import { drillScore, nogginScore, zScore } from '../scoring';

describe('drillScore', () => {
  const qs = NORMS.quickSums; // 30s mean, 9s SD, lower is better

  it('average is 50', () => {
    expect(drillScore(30, qs)).toBe(50);
  });

  it('one SD faster is 60, two is 70', () => {
    expect(drillScore(21, qs)).toBe(60);
    expect(drillScore(12, qs)).toBe(70);
  });

  it('one SD slower is 40', () => {
    expect(drillScore(39, qs)).toBe(40);
  });

  it('higher is better for count drills', () => {
    const sm = NORMS.symbolMatch; // 48 mean, 12 SD
    expect(drillScore(60, sm)).toBe(60);
    expect(drillScore(36, sm)).toBe(40);
  });

  it('never goes negative', () => {
    expect(drillScore(500, qs)).toBe(0);
  });

  it('log time option keeps direction and is centred near the mean', () => {
    expect(zScore(20, qs, 'log')).toBeGreaterThan(0);
    expect(zScore(40, qs, 'log')).toBeLessThan(0);
    expect(Math.abs(zScore(30, qs, 'log'))).toBeLessThan(0.2);
  });
});

describe('nogginScore', () => {
  it('is the rounded average of drill scores', () => {
    expect(nogginScore([50, 60])).toBe(55);
    expect(nogginScore([51, 60])).toBe(56);
    expect(nogginScore([70])).toBe(70);
  });

  it('needs at least one drill', () => {
    expect(() => nogginScore([])).toThrow();
  });
});
