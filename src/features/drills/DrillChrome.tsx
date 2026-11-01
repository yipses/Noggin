import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../../ui/Button';
import { CloseIcon } from '../../ui/icons';
import { Noggin } from '../../ui/Noggin';
import { ProgressBar } from '../../ui/Progress';
import { SpeechBubble } from '../../ui/SpeechBubble';
import { Label } from '../../ui/text';
import { Expression } from '../../ui/noggin/nogginArt';

/** Close button, thin progress bar, "7/20". */
export function DrillTopBar({ index, total, onClose, tag }: { index: number; total: number; onClose: () => void; tag?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <IconButton label="Close" onPress={onClose}>
        <CloseIcon />
      </IconButton>
      <ProgressBar value={index / total} />
      <Label size={13} weight="medium" style={{ minWidth: 44, textAlign: 'right' }}>
        {tag ? `${tag} ` : ''}
        {Math.min(index + 1, total)}/{total}
      </Label>
    </View>
  );
}

/** The noggin watching from the bottom left, with a short reaction bubble. */
export function Watcher({ line, expression, width = 92 }: { line: string | null; expression: Expression; width?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 12, minHeight: width * 0.85 + 8 }} pointerEvents="none">
      <Noggin width={width} expression={expression} />
      {line && <SpeechBubble text={line} tail="bottom-left" style={{ marginLeft: -6, marginBottom: width * 0.55 }} />}
    </View>
  );
}

/** Reaction line + expression that fade back to calm. */
export function useReaction() {
  const [line, setLine] = useState<string | null>(null);
  const [expression, setExpression] = useState<Expression>('calm');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const react = useCallback((text: string, happy: boolean, ms = 900) => {
    setLine(text);
    setExpression(happy ? 'happy' : 'calm');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLine(null);
      setExpression('calm');
    }, ms);
  }, []);
  return { line, expression, react };
}

/**
 * Measures active solving time only: from when an item is shown to its right
 * answer, summed. The short feedback pause between items isn't counted, so
 * the pen animation never costs the player score.
 */
export function useItemClock() {
  const shownAt = useRef(Date.now());
  const total = useRef(0);
  return {
    show: () => {
      shownAt.current = Date.now();
    },
    solve: () => {
      total.current += Date.now() - shownAt.current;
    },
    seconds: () => total.current / 1000,
  };
}

export const FEEDBACK_MS = 360;
