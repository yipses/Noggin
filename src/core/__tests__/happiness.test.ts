import {
  DRAIN_PER_DAY, FILL, GRACE_HOURS, LEVEL_AFTER_GIFT, REUNION_BONUS,
  HappinessState, currentLevel, fill, initialHappiness, preview, settle,
} from '../happiness';

const t0 = new Date('2026-10-18T09:00:00Z');
const later = (h: number) => new Date(t0.getTime() + h * 3_600_000);

const played = (level: number): HappinessState => ({
  level, lastPlayedAt: t0.toISOString(), settledAt: t0.toISOString(), gifts: 0,
});

describe('happiness meter', () => {
  it('the daily test fills the most, training a little', () => {
    expect(FILL.dailyTest).toBeGreaterThan(FILL.training);
    const r = fill(played(0.5), 'dailyTest', later(1));
    expect(r.state.level).toBeCloseTo(0.5 + FILL.dailyTest);
    expect(r.gift).toBe(false);
  });

  it('a full meter gives a gift and drops back part way', () => {
    const r = fill(played(0.9), 'dailyTest', later(1));
    expect(r.gift).toBe(true);
    expect(r.state.gifts).toBe(1);
    expect(r.state.level).toBeCloseTo(LEVEL_AFTER_GIFT + 0.25);
  });

  it('does not drain during a normal daily rhythm', () => {
    expect(currentLevel(played(0.6), later(24))).toBeCloseTo(0.6);
  });

  it('drains while away', () => {
    expect(currentLevel(played(0.6), later(GRACE_HOURS + 48))).toBeCloseTo(0.6 - 2 * DRAIN_PER_DAY);
  });

  it('settling twice does not drain twice', () => {
    const once = settle(played(0.6), later(GRACE_HOURS + 24)).state;
    const twice = settle(once, later(GRACE_HOURS + 24)).state;
    expect(twice.level).toBeCloseTo(once.level);
  });

  it('coming back to an empty meter gives the reunion bonus', () => {
    const r = settle(played(0.2), later(24 * 14));
    expect(r.reunion).toBe(true);
    expect(r.state.level).toBeCloseTo(REUNION_BONUS);
  });

  it('a brand new noggin gets no reunion', () => {
    expect(settle(initialHappiness(t0), later(500)).reunion).toBe(false);
  });

  it('preview shows the next action and whether it reaches the gift', () => {
    expect(preview(played(0.5), 'dailyTest', later(1))).toEqual({ from: 0.5, to: 0.85, reachesGift: false });
    expect(preview(played(0.7), 'dailyTest', later(1)).reachesGift).toBe(true);
  });
});
