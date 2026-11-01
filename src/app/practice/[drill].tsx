import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DRILLS } from '../../core/drills';
import { DrillId } from '../../core/norms';
import { useApp } from '../../state/AppState';
import { DrillRunner } from '../../features/drills/DrillRunner';
import { Paper } from '../../ui/Paper';

/** Optional training from the Drills tab. Doesn't change the Noggin Score; fills happiness a little. */
export default function Practice() {
  const { drill } = useLocalSearchParams<{ drill: string }>();
  const { completeTraining } = useApp();
  // A new seed each run so training never repeats the daily test's content.
  const [seed] = useState(() => `training-${Date.now()}`);
  const info = DRILLS[drill as DrillId];
  if (!info || !info.built) return <Redirect href="/drills" />;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/drills'));

  return (
    <Paper>
      <DrillRunner
        drillId={info.id}
        seed={seed}
        caption="training"
        comparisonFor={() => 'training'}
        doneButton="Done"
        onResult={() => completeTraining()}
        onNext={close}
        onClose={close}
      />
    </Paper>
  );
}
