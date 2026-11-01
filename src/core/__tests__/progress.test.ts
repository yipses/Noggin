import { addDays, dayKey, daysBetween } from '../day';
import {
  DayRecord, History, addRecord, daysTrainedInMonth, drillComparisonText,
  lastDrillScore, trendText, weeklyTrend,
} from '../progress';

const rec = (day: string, score: number): DayRecord => ({
  day,
  nogginScore: score,
  completedAt: `${day}T12:00:00.000Z`,
  drills: [
    { drillId: 'quickSums', raw: 30, mistakes: 0, score },
    { drillId: 'highsLows', raw: 24, mistakes: 0, score },
  ],
});

describe('day keys', () => {
  it('late night play counts for the previous day until 4am', () => {
    expect(dayKey(new Date(2026, 9, 18, 23, 30))).toBe('2026-10-18');
    expect(dayKey(new Date(2026, 9, 19, 3, 59))).toBe('2026-10-18');
    expect(dayKey(new Date(2026, 9, 19, 4, 0))).toBe('2026-10-19');
  });

  it('adds days across month ends', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(daysBetween('2026-10-25', '2026-11-01')).toBe(7);
  });
});

describe('history', () => {
  it('only the first attempt each day counts', () => {
    let h: History = [];
    h = addRecord(h, rec('2026-10-18', 52));
    h = addRecord(h, rec('2026-10-18', 70));
    expect(h).toHaveLength(1);
    expect(h[0].nogginScore).toBe(52);
  });

  it('counts days trained in a month', () => {
    const h = [rec('2026-09-30', 50), rec('2026-10-01', 50), rec('2026-10-18', 50)];
    expect(daysTrainedInMonth(h, '2026-10')).toBe(2);
  });
});

describe('weekly trend', () => {
  it('shows +N when the score went up', () => {
    const h = [rec('2026-10-10', 50), rec('2026-10-17', 52)];
    const t = weeklyTrend(h, '2026-10-17');
    expect(t).toEqual({ kind: 'up', delta: 2 });
    expect(trendText(t)).toBe('+2 this week');
  });

  it('shows days trained instead of a negative number when it dipped', () => {
    const h = [rec('2026-10-08', 58), rec('2026-10-15', 55), rec('2026-10-17', 53)];
    const t = weeklyTrend(h, '2026-10-17');
    expect(t).toEqual({ kind: 'trained', days: 2 });
    expect(trendText(t)).toBe('trained 2 days this week');
    expect(trendText(t)).not.toMatch(/-\d/);
  });

  it('early on, compares with the first score', () => {
    expect(weeklyTrend([rec('2026-10-15', 48), rec('2026-10-17', 51)], '2026-10-17')).toEqual({ kind: 'up', delta: 3 });
  });

  it('never points at an empty week', () => {
    expect(trendText(weeklyTrend([rec('2026-09-01', 50), rec('2026-09-02', 49)], '2026-10-17'))).toBe('your last score');
  });

  it('a single score shows days trained', () => {
    expect(trendText(weeklyTrend([rec('2026-10-17', 50)], '2026-10-17'))).toBe('trained 1 day this week');
  });
});

describe('drill comparison', () => {
  it('compares with the previous daily test, never negative', () => {
    const h = [rec('2026-10-16', 50), rec('2026-10-17', 54)];
    expect(lastDrillScore(h, 'quickSums', '2026-10-18')).toBe(54);
    expect(drillComparisonText(57, 54)).toBe('+3 last time');
    expect(drillComparisonText(50, 54)).toBe('nicely done');
    expect(drillComparisonText(50, undefined)).toBe('first time!');
  });
});
