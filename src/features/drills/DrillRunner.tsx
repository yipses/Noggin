import { useMemo, useState } from 'react';
import { drillDoneLine } from '../../core/copy';
import { NORMS } from '../../core/drills';
import { DrillId } from '../../core/norms';
import { rngFor } from '../../core/rng';
import { drillScore } from '../../core/scoring';
import { DrillIntro } from './DrillIntro';
import { DrillDone } from './DrillDone';
import { HighsLowsPlay } from './HighsLowsPlay';
import { PlayResult, QuickSumsPlay } from './QuickSumsPlay';

export const PRACTICE_COUNT = 5;

interface Props {
  drillId: DrillId;
  /** Content seed: the day key, so content is fresh daily. */
  seed: string;
  caption: string;
  dots?: { total: number; done: number };
  /** Text under the score: "+3 last time" etc. */
  comparisonFor: (score: number) => string;
  doneButton: string;
  onResult: (r: PlayResult & { drillId: DrillId; score: number }) => void;
  onNext: () => void;
  onClose: () => void;
}

type Phase = 'intro' | 'practice' | 'play' | 'done';

/** intro -> (practice, untimed) -> play -> done, for one drill. */
export function DrillRunner({ drillId, seed, caption, dots, comparisonFor, doneButton, onResult, onNext, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [practised, setPractised] = useState(false);
  const [score, setScore] = useState(0);
  const line = useMemo(() => drillDoneLine(rngFor('done', seed, drillId)), [seed, drillId]);
  const Play = drillId === 'highsLows' ? HighsLowsPlay : QuickSumsPlay;

  if (phase === 'intro') {
    return (
      <DrillIntro
        drillId={drillId}
        caption={caption}
        showPractice={!practised}
        tip={practised ? 'Ready when you are!' : undefined}
        onStart={() => setPhase('play')}
        onPractice={() => setPhase('practice')}
        onClose={onClose}
      />
    );
  }
  if (phase === 'practice') {
    return (
      <Play
        key="practice"
        seed={`practice-${seed}`}
        count={PRACTICE_COUNT}
        practice
        onClose={() => setPhase('intro')}
        onComplete={() => {
          setPractised(true);
          setPhase('intro');
        }}
      />
    );
  }
  if (phase === 'play') {
    return (
      <Play
        key="play"
        seed={seed}
        onClose={onClose}
        onComplete={(r) => {
          const s = drillScore(r.seconds, NORMS[drillId]);
          setScore(s);
          onResult({ ...r, drillId, score: s });
          setPhase('done');
        }}
      />
    );
  }
  return (
    <DrillDone
      dots={dots}
      line={line}
      score={score}
      comparison={comparisonFor(score)}
      buttonTitle={doneButton}
      onNext={onNext}
    />
  );
}
