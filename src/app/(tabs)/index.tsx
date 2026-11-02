import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AFTER_TEST, REUNION, greeting, possessive } from '../../core/copy';
import { monthAbbrev, monthOf, timeOfDay } from '../../core/day';
import { preview } from '../../core/happiness';
import { daysTrainedInMonth, latestRecord, trendText, weeklyTrend } from '../../core/progress';
import { sharing } from '../../services';
import { useApp } from '../../state/AppState';
import { Button, IconButton } from '../../ui/Button';
import { CalendarTile } from '../../ui/CalendarTile';
import { GridRule } from '../../ui/GridRule';
import { HappinessMeter } from '../../ui/HappinessMeter';
import { ProfileIcon, ShareIcon } from '../../ui/icons';
import { Noggin } from '../../ui/Noggin';
import { Paper } from '../../ui/Paper';
import { SpeechBubble } from '../../ui/SpeechBubble';
import { TapedNote } from '../../ui/TapedNote';
import { Label, Pen, Printed } from '../../ui/text';
import { color } from '../../ui/theme';

/**
 * Home: three bands. Top: calendar tile and profile. Middle: the noggin with
 * its speech bubble, the score note, and "Your noggin" on its name line. Bottom (thumb
 * reach): the happiness row and the main action.
 */
export default function Home() {
  const insets = useSafeAreaInsets();
  const { data, now, today, takenToday, reunion } = useApp();
  const profile = data.profile!;
  const latest = latestRecord(data.history, today);
  const trend = weeklyTrend(data.history, today);
  const daysThisMonth = daysTrainedInMonth(data.history, monthOf(today));
  const next = preview(data.happiness, takenToday ? 'training' : 'dailyTest', now);

  const bubble = takenToday ? AFTER_TEST : reunion ? REUNION : greeting(timeOfDay(now), profile.playerName);

  const share = () => {
    if (!latest) return;
    sharing.shareText(`My Noggin Score today: ${latest.nogginScore}. My noggin says hi! Grow Your Noggin.`);
  };

  return (
    <Paper>
      <View style={{ flex: 1, paddingTop: insets.top + 10, paddingHorizontal: 20 }}>
        {/* Top bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CalendarTile month={monthAbbrev(today)} days={daysThisMonth} onPress={() => router.push('/calendar')} />
          <IconButton label="Profile" onPress={() => router.push('/me')}>
            <ProfileIcon />
          </IconButton>
        </View>

        {/* The noggin */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 120 }}>
            {/* Sits at the bottom of the row so its tail reaches down to the noggin. */}
            <SpeechBubble text={bubble} tail="bottom-right" style={{ alignSelf: 'flex-end', marginBottom: -6, maxWidth: 190 }} />
            <TapedNote rotate={4} width={124} style={{ marginBottom: 6 }}>
              <Label size={11}>noggin score</Label>
              {latest ? (
                <>
                  <Pen size={44} style={{ lineHeight: 52 }} accessibilityLabel={`Noggin score ${latest.nogginScore}`}>{latest.nogginScore}</Pen>
                  <Label size={11} colour={color.trendUp} weight="medium" align="center">{trendText(trend)}</Label>
                </>
              ) : (
                <Label size={11} align="center" style={{ marginTop: 10 }}>after your first test</Label>
              )}
            </TapedNote>
          </View>
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <Noggin width={250} expression={takenToday ? 'happy' : 'calm'} sparkles={takenToday} />
            <View style={{ alignItems: 'center', marginTop: 4 }}>
              <NogginNameLine name={profile.playerName} />
              <GridRule width={220} />
            </View>
          </View>
        </View>

        {/* Bottom, in thumb reach */}
        <View style={{ paddingBottom: 14 }}>
          <HappinessMeter level={next.from} previewTo={next.to} giftLit={next.reachesGift} />
          <View style={{ marginTop: 16 }}>
            {takenToday ? (
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Button title="Training" onPress={() => router.push('/drills')} style={{ flex: 1, paddingHorizontal: 10 }} />
                {/* Bonus game concept is an open question (design.md section 13). */}
                <Button title="Bonus game" variant="secondary" disabled style={{ flex: 1.1, paddingHorizontal: 10 }} />
                <IconButton label="Share" onPress={share} size={56}>
                  <ShareIcon />
                </IconButton>
              </View>
            ) : (
              <Button title="Today's training" note="5 min" onPress={() => router.push('/test')} testID="start-test" />
            )}
          </View>
        </View>
      </View>
    </Paper>
  );
}

/**
 * "Derek's noggin" on the name line: the player's name in their pen, the word
 * "noggin" printed. Without a name it reads "Your noggin", all printed.
 */
function NogginNameLine({ name }: { name: string }) {
  const n = name.trim();
  if (!n) return <Printed size={22} weight="medium" style={{ lineHeight: 34 }}>Your noggin</Printed>;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, maxWidth: 300 }} accessibilityLabel={possessive(n) + ' noggin'}>
      <Pen size={28} style={{ lineHeight: 34, flexShrink: 1 }} numberOfLines={1}>{possessive(n)}</Pen>
      <Printed size={22} weight="medium" style={{ lineHeight: 34 }}>noggin</Printed>
    </View>
  );
}

