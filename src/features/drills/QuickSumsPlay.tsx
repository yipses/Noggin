import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { almostLine, rightLine } from '../../core/copy';
import { generateQuickSums, problemText } from '../../core/drills/quickSums';
import { rngFor } from '../../core/rng';
import { haptics } from '../../services';
import { GridRule } from '../../ui/GridRule';
import { PenCircle, PenPop, PenStrike } from '../../ui/PenMarks';
import { Pen, Printed } from '../../ui/text';
import { color, size } from '../../ui/theme';
import { DrillTopBar, FEEDBACK_MS, Watcher, useItemClock, useReaction } from './DrillChrome';

export interface PlayResult {
  seconds: number;
  mistakes: number;
}

interface Props {
  seed: string;
  count?: number;
  practice?: boolean;
  onComplete: (r: PlayResult) => void;
  onClose: () => void;
}

/** Quick Sums: one problem, a printed answer line, four answer cards in a 2x2 grid in thumb reach. */
export function QuickSumsPlay({ seed, count, practice, onComplete, onClose }: Props) {
  const problems = useMemo(() => generateQuickSums(seed, count), [seed, count]);
  const [i, setI] = useState(0);
  const [struck, setStruck] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const mistakes = useRef(0);
  const clock = useItemClock();
  const { line, expression, react } = useReaction();
  const rng = useMemo(() => rngFor('qs-lines', seed), [seed]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const p = problems[i];

  useEffect(() => {
    clock.show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const tap = (choice: number) => {
    if (solved || struck.includes(choice)) return;
    if (choice === p.answer) {
      clock.solve();
      haptics.right();
      setSolved(true);
      react(rightLine(rng), true, FEEDBACK_MS + 200);
      setTimeout(() => {
        if (i + 1 >= problems.length) {
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
      setStruck((s) => [...s, choice]);
    }
  };

  const cardW = (Math.min(width, 480) - 32 - 14) / 2;

  return (
    <View style={{ flex: 1 }}>
      <DrillTopBar index={i} total={problems.length} onClose={onClose} tag={practice ? 'practice' : undefined} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Printed weight="bold" size={64} accessibilityRole="header">{problemText(p)}</Printed>
        <View style={{ marginTop: 18, width: 160, alignItems: 'center' }}>
          <View style={{ height: 50, justifyContent: 'flex-end' }}>
            {solved && (
              <PenPop>
                <Pen size={42} style={{ lineHeight: 50 }}>{p.answer}</Pen>
              </PenPop>
            )}
          </View>
          <GridRule width={160} />
        </View>
      </View>

      <Watcher line={line} expression={expression} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: 16, paddingBottom: insets.bottom + 24, paddingTop: 12, justifyContent: 'center' }}>
        {p.choices.map((c) => {
          const isStruck = struck.includes(c);
          const isRight = solved && c === p.answer;
          return (
            <Pressable
              key={`${i}-${c}`}
              accessibilityRole="button"
              accessibilityLabel={String(c)}
              onPress={() => tap(c)}
              style={({ pressed }) => [
                {
                  width: cardW, height: 84, borderRadius: size.radiusCard, backgroundColor: '#FFFFFF',
                  borderWidth: size.lineWeightUi, borderBottomWidth: 4, borderColor: color.ink,
                  alignItems: 'center', justifyContent: 'center',
                },
                isStruck && { transform: [{ rotate: '-3deg' }], opacity: 0.8 },
                pressed && !isStruck && { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
              ]}
            >
              <View>
                <Printed weight="bold" size={34} colour={isStruck ? color.inkMuted : color.ink}>{c}</Printed>
                {isRight && <PenCircle inset={-12} style={{ left: -20, right: -20 }} />}
                {isStruck && <PenStrike style={{ left: -14, right: -14 }} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
