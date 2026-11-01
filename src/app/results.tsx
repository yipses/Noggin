import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DRILLS } from '../core/drills';
import { currentLevel } from '../core/happiness';
import { recordFor } from '../core/progress';
import { useApp } from '../state/AppState';
import { Button } from '../ui/Button';
import { GridRule } from '../ui/GridRule';
import { HappinessMeter } from '../ui/HappinessMeter';
import { Noggin } from '../ui/Noggin';
import { Paper } from '../ui/Paper';
import { SpeechBubble } from '../ui/SpeechBubble';
import { TapedNote } from '../ui/TapedNote';
import { Label, Pen, Printed } from '../ui/text';

/** Today's Noggin Score and the noggin's reaction. The first score is a warm moment, never a grade. */
export default function Results() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ from?: string; gift?: string; first?: string }>();
  const { data, today, now } = useApp();
  const record = recordFor(data.history, today);
  const first = params.first === '1';
  const gift = params.gift === '1';
  const level = currentLevel(data.happiness, now);

  const bubble = gift ? 'A gift for you!' : first ? 'Nice to meet you!' : 'That felt great!';

  return (
    <Paper>
      <View style={{ flex: 1, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Label size={13}>{first ? 'your first score' : "today's score"}</Label>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <SpeechBubble text={bubble} tail="bottom-right" style={{ marginBottom: 6 }} />
            <TapedNote rotate={3} width={136}>
              <Label size={11}>noggin score</Label>
              <Pen size={58} style={{ lineHeight: 68 }} accessibilityLabel={`Noggin score ${record?.nogginScore ?? ''}`}>
                {record?.nogginScore ?? ''}
              </Pen>
            </TapedNote>
          </View>
          <View style={{ alignItems: 'center', marginTop: 6 }}>
            <Noggin width={230} expression="happy" sparkles />
          </View>

          {first && (
            <Printed size={17} align="center" style={{ marginTop: 18 }}>
              This is your starting point. It grows as you play!
            </Printed>
          )}

          <View style={{ marginTop: 20, alignSelf: 'center', width: 260 }}>
            {record?.drills.map((d) => (
              <View key={d.drillId} style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <Printed size={15}>{DRILLS[d.drillId].name}</Printed>
                <View style={{ alignItems: 'flex-end' }}>
                  <Pen size={24} style={{ lineHeight: 30 }}>{d.score}</Pen>
                </View>
              </View>
            ))}
            <GridRule width={260} />
          </View>
        </View>

        <View style={{ marginBottom: 18 }}>
          <HappinessMeter level={level} giftLit={gift} />
        </View>
        <Button title="Done" onPress={() => router.replace('/')} testID="results-done" />
      </View>
    </Paper>
  );
}
