import { Persisted, migrate } from '../persisted';

const base = {
  version: 1 as const,
  history: [],
  happiness: { level: 0.5, lastPlayedAt: null, settledAt: '2026-11-01T00:00:00Z', gifts: 0 },
};

describe('save migration', () => {
  it('drops the old noggin name and starts with an empty player name', () => {
    const old = { ...base, profile: { nogginName: 'Mochi', birthYear: 1988, createdAt: 'x' } } as unknown as Persisted;
    expect(migrate(old).profile).toEqual({ playerName: '', birthYear: 1988, createdAt: 'x' });
  });

  it('leaves new saves alone', () => {
    const cur: Persisted = { ...base, profile: { playerName: 'Derek', birthYear: 1980, createdAt: 'y' } };
    expect(migrate(cur)).toBe(cur);
  });

  it('handles no profile', () => {
    const none: Persisted = { ...base, profile: null };
    expect(migrate(none)).toBe(none);
  });
});
