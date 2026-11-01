import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { DAILY_TEST } from '../core/drills';
import { drillComparisonText, lastDrillScore } from '../core/progress';
import { haptics } from '../services';
import { RawRun, useApp } from '../state/AppState';
import { DrillRunner } from '../features/drills/DrillRunner';
import { Paper } from '../ui/Paper';

/**
 * Today's score test: each drill in turn (intro, play, done), then results.
 * Only the first completed test each day counts. Leaving part way through
 * doesn't record anything (see design.md, Proposed).
 */
export default function DailyTest() {
  const { data, today, takenToday, completeDailyTest } = useApp();
  const [index, setIndex] = useState(0);
  const runs = useRef<RawRun[]>([]);
  const finished = useRef(false);

  if (takenToday && !finished.current) return <Redirect href="/" />;

  const drillId = DAILY_TEST[index];
  const last = index === DAILY_TEST.length - 1;
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Paper>
      <DrillRunner
        key={drillId}
        drillId={drillId}
        seed={today}
        caption={`drill ${index + 1} of ${DAILY_TEST.length}`}
        dots={{ total: DAILY_TEST.length, done: index + 1 }}
        comparisonFor={(s) => drillComparisonText(s, lastDrillScore(data.history, drillId, today))}
        doneButton={last ? 'See my score' : 'Next drill'}
        onResult={(r) => {
          runs.current[index] = { drillId: r.drillId, seconds: r.seconds, mistakes: r.mistakes };
        }}
        onNext={() => {
          if (!last) {
            setIndex(index + 1);
            return;
          }
          const firstEver = data.history.length === 0;
          finished.current = true;
          const res = completeDailyTest(runs.current);
          haptics.celebrate();
          router.replace({
            pathname: '/results',
            params: {
              score: String(res.record.nogginScore),
              from: String(res.from),
              gift: res.gift ? '1' : '0',
              first: firstEver ? '1' : '0',
            },
          });
        }}
        onClose={close}
      />
    </Paper>
  );
}
