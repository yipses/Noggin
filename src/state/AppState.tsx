import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState as RNAppState } from 'react-native';
import { DAILY_TEST, NORMS } from '../core/drills';
import { dayKey } from '../core/day';
import { HappinessState, fill, initialHappiness, settle } from '../core/happiness';
import { DrillId } from '../core/norms';
import { DayRecord, DrillRun, History, addRecord, hasTakenTest } from '../core/progress';
import { drillScore, drillScoreExact, nogginScore } from '../core/scoring';
import { KeyValueStore, storage as defaultStorage } from '../services';
import { Persisted, migrate } from './persisted';

export type { Persisted, Profile } from './persisted';

const KEY = 'noggin/state/v1';

export interface RawRun {
  drillId: DrillId;
  seconds: number;
  mistakes: number;
}

interface Ctx {
  ready: boolean;
  data: Persisted;
  /** "Now" for the UI; refreshed when the app comes to the foreground. */
  now: Date;
  today: string;
  /** True once per app open when the reunion bonus fired. */
  reunion: boolean;
  takenToday: boolean;
  createProfile(playerName: string, birthYear: number): void;
  /** Records today's daily test (first attempt only) and fills happiness. */
  completeDailyTest(runs: RawRun[]): { record: DayRecord; gift: boolean; from: number; counted: boolean };
  /** A training run from the Drills tab: fills happiness a little. */
  completeTraining(): { gift: boolean };
  /** Development helpers (Me tab). */
  resetAll(): void;
  seedSampleWeek(): void;
}

const AppCtx = createContext<Ctx | null>(null);

function fresh(now: Date): Persisted {
  return { version: 1, profile: null, history: [], happiness: initialHappiness(now) };
}

export function scoreRuns(runs: RawRun[]): { drills: DrillRun[]; noggin: number } {
  const drills = runs.map((r) => ({
    drillId: r.drillId,
    raw: Math.round(r.seconds * 10) / 10,
    mistakes: r.mistakes,
    score: drillScore(r.seconds, NORMS[r.drillId]),
  }));
  // Average the unrounded scores so rounding happens once.
  const noggin = nogginScore(runs.map((r) => drillScoreExact(r.seconds, NORMS[r.drillId])));
  return { drills, noggin };
}

export function AppStateProvider({ children, store = defaultStorage }: { children: ReactNode; store?: KeyValueStore }) {
  const [now, setNow] = useState(() => new Date());
  const [ready, setReady] = useState(false);
  const [reunion, setReunion] = useState(false);
  const [data, setData] = useState<Persisted>(() => fresh(new Date()));
  const dataRef = useRef(data);
  dataRef.current = data;

  const commit = useCallback(
    (next: Persisted) => {
      dataRef.current = next;
      setData(next);
      store.set(KEY, JSON.stringify(next)).catch(() => {});
    },
    [store],
  );

  // Load, then settle the meter (drain while away, reunion bonus).
  useEffect(() => {
    let alive = true;
    (async () => {
      const t = new Date();
      let loaded = fresh(t);
      try {
        const raw = await store.get(KEY);
        if (raw) loaded = migrate({ ...loaded, ...(JSON.parse(raw) as Persisted) });
      } catch {
        // Corrupt or unavailable storage: start fresh rather than crash.
      }
      if (!alive) return;
      const s = settle(loaded.happiness, t);
      setReunion(s.reunion && loaded.profile !== null);
      commit({ ...loaded, happiness: s.state });
      setNow(t);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [store, commit]);

  // Refresh "now" when returning to the app so the day rolls over at 4am.
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (st) => {
      if (st !== 'active') return;
      const t = new Date();
      setNow(t);
      const s = settle(dataRef.current.happiness, t);
      if (s.reunion && dataRef.current.profile) setReunion(true);
      commit({ ...dataRef.current, happiness: s.state });
    });
    return () => sub.remove();
  }, [commit]);

  const today = dayKey(now);

  const value = useMemo<Ctx>(() => {
    const takenToday = hasTakenTest(data.history, today);
    return {
      ready, data, now, today, reunion, takenToday,
      createProfile(playerName, birthYear) {
        commit({ ...dataRef.current, profile: { playerName: playerName.trim(), birthYear, createdAt: new Date().toISOString() } });
      },
      completeDailyTest(runs) {
        const t = new Date();
        const day = dayKey(t);
        const cur = dataRef.current;
        const { drills, noggin } = scoreRuns(runs);
        const record: DayRecord = { day, nogginScore: noggin, drills, completedAt: t.toISOString() };
        if (hasTakenTest(cur.history, day)) {
          return { record, gift: false, from: cur.happiness.level, counted: false };
        }
        const f = fill(cur.happiness, 'dailyTest', t);
        commit({ ...cur, history: addRecord(cur.history, record), happiness: f.state });
        setNow(t);
        setReunion(false);
        return { record, gift: f.gift, from: f.from, counted: true };
      },
      completeTraining() {
        const t = new Date();
        const f = fill(dataRef.current.happiness, 'training', t);
        commit({ ...dataRef.current, happiness: f.state });
        return { gift: f.gift };
      },
      resetAll() {
        const t = new Date();
        setReunion(false);
        commit(fresh(t));
      },
      seedSampleWeek() {
        // A believable past week for trying the home screen states.
        const t = new Date();
        let history: History = [];
        const scores = [46, 48, 47, 51, 50, 53];
        scores.forEach((s, i) => {
          const d = new Date(t.getTime() - (scores.length - i) * 86_400_000);
          const day = dayKey(d);
          history = addRecord(history, {
            day, nogginScore: s, completedAt: d.toISOString(),
            drills: DAILY_TEST.map((id) => ({ drillId: id, raw: 0, mistakes: 0, score: s })),
          });
        });
        const happiness: HappinessState = { level: 0.5, lastPlayedAt: new Date(t.getTime() - 86_400_000).toISOString(), settledAt: t.toISOString(), gifts: 1 };
        commit({ ...dataRef.current, history, happiness });
      },
    };
  }, [ready, data, now, today, reunion, commit]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used inside AppStateProvider');
  return c;
}
