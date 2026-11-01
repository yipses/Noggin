import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { almostLine, rightLine } from '../../core/copy';
import { generateHighsLows } from '../../core/drills/highsLows';
import { rngFor, shuffle } from '../../core/rng';
import { haptics } from '../../services';
import { Highlighter } from '../../ui/Highlighter';
import { ArrowIcon } from '../../ui/icons';
import { PenCircle, PenStrike } from '../../ui/PenMarks';
import { Label, Printed } from '../../ui/text';
import { color } from '../../ui/theme';
import { DrillTopBar, FEEDBACK_MS, Watcher, useItemClock, useReaction } from './DrillChrome';
import { PlayResult } from './QuickSumsPlay';

interface Props {
  seed: string;
  count?: number;
  practice?: boolean;
  onComplete: (r: PlayResult) => void;
  onClose: () => void;
}

/** Five loose spots on the paper, as fractions of the play area. */
const SLOTS = [
  [0.24, 0.17], [0.74, 0.2], [0.48, 0.5], [0.2, 0.82], [0.78, 0.8],
];
const MAX_FONT = 96;

/** Highs and Lows: five numbers in mismatched sizes directly on the paper. */
export function HighsLowsPlay({ seed, count, practice, onComplete, onClose }: Props) {
  const screens = useMemo(() => generateHighsLows(seed, count), [seed, count]);
  const [i, setI] = useState(0);
  const [struck, setStruck] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const mistakes = useRef(0);
  const clock = useItemClock();
  const { line, expression, react } = useReaction();
  const insets = useSafeAreaInsets();
  const rng = useMemo(() => rngFor('hl-lines', seed), [seed]);
  const s = screens[i];

  // Where each number sits on this screen: shuffled slots with a little jitter.
  const spots = useMemo(() => {
    const r = rngFor('hl-layout', seed, i);
    return shuffle(r, SLOTS).map(([x, y]) => [x + (r() - 0.5) * 0.08, y + (r() - 0.5) * 0.06]);
  }, [seed, i]);

  useEffect(() => {
    clock.show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const tap = (idx: number) => {
    if (solved || struck.includes(idx)) return;
    if (idx === s.answerIndex) {
      clock.solve();
      haptics.right();
      setSolved(true);
      react(rightLine(rng), true, FEEDBACK_MS + 200);
      setTimeout(() => {
        if (i + 1 >= screens.length) {
          onComplete({ seconds: clock.seconds(), mistakes: mistakes.current });
        } else {
          setI(i + 1);
          setStruck([]);
          setSolved(false);
        }
      }, FEEDBACK_MS);
    } else {
      haptics.wrong();
      react(almostLine(mistakes.current), false);
      mistakes.current += 1;
      setStruck((x) => [...x, idx]);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setArea({ w, h });
  };
  const fontScale = Math.min(1, area.h / 420);

  return (
    <View style={{ flex: 1 }}>
      <DrillTopBar index={i} total={screens.length} onClose={onClose} tag={practice ? 'practice' : undefined} />

      <View style={{ alignItems: 'center', marginTop: 18 }} accessibilityLabel={`tap the ${s.mode}`}>
        <Label size={14}>tap the</Label>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
          <Highlighter>
            <Printed weight="bold" size={40}>{s.mode}</Printed>
          </Highlighter>
          <ArrowIcon up={s.mode === 'highest'} size={30} />
        </View>
      </View>

      <View style={{ flex: 1, marginHorizontal: 16 }} onLayout={onLayout}>
        {area.w > 0 &&
          s.items.map((it, idx) => {
            const fs = Math.round(MAX_FONT * it.size * fontScale);
            const box = Math.max(64, fs * 1.05);
            const [fx, fy] = spots[idx];
            const left = Math.min(area.w - box, Math.max(0, fx * area.w - box / 2));
            const top = Math.min(area.h - box, Math.max(0, fy * area.h - box / 2));
            const isStruck = struck.includes(idx);
            const isRight = solved && idx === s.answerIndex;
            return (
              <Pressable
                key={`${i}-${idx}`}
                accessibilityRole="button"
                accessibilityLabel={String(it.value)}
                onPress={() => tap(idx)}
                style={{ position: 'absolute', left, top, width: box, height: box, alignItems: 'center', justifyContent: 'center' }}
              >
                <Printed weight="bold" size={fs} colour={isStruck ? color.inkMuted : color.ink} style={{ lineHeight: fs * 1.15 }}>
                  {it.value}
                </Printed>
                {isRight && <PenCircle inset={Math.max(2, box * 0.08)} />}
                {isStruck && <PenStrike style={{ left: box * 0.15, right: box * 0.15 }} />}
              </Pressable>
            );
          })}
      </View>

      <View style={{ paddingBottom: insets.bottom + 28 }}>
        <Watcher line={line} expression={expression} />
      </View>
    </View>
  );
}
