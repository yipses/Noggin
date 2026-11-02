import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../ui/Button';
import { Noggin } from '../../ui/Noggin';
import { ProgressDots } from '../../ui/Progress';
import { SpeechBubble } from '../../ui/SpeechBubble';
import { TapedNote } from '../../ui/TapedNote';
import { Label, Pen } from '../../ui/text';
import { color } from '../../ui/theme';

interface Props {
  dots?: { total: number; done: number };
  line: string;
  score: number;
  comparison: string;
  buttonTitle: string;
  onNext: () => void;
}

/** Drill done: progress dots, a happy noggin, the score handwritten on a taped note. */
export function DrillDone({ dots, line, score, comparison, buttonTitle, onNext }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20, paddingHorizontal: 20 }}>
      {dots ? (
        <View style={{ alignItems: 'center', gap: 6 }}>
          <ProgressDots total={dots.total} done={dots.done} />
          <Label size={12}>{dots.done} of {dots.total} done</Label>
        </View>
      ) : (
        <View style={{ height: 12 }} />
      )}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <SpeechBubble text={line} tail="bottom" style={{ alignSelf: 'center', marginBottom: 18 }} />
        <Noggin width={220} expression="happy" />
        <TapedNote rotate={-3} width={150} style={{ marginTop: 28 }}>
          <Label size={12}>drill score</Label>
          <Pen size={52} style={{ lineHeight: 62 }} accessibilityLabel={`Drill score ${score}`}>{score}</Pen>
          <Label size={12} colour={color.trendUp} weight="medium">{comparison}</Label>
        </TapedNote>
      </View>
      <Button title={buttonTitle} onPress={onNext} testID="drill-next" />
    </View>
  );
}
