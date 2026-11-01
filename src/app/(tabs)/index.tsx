import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AFTER_TEST, GREETING, REUNION } from '../../core/copy';
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
import { Label, Pen } from '../../ui/text';
import { color } from '../../ui/theme';

/**
 * Home: three bands. Top: calendar tile and profile. Middle: the noggin with
 * its speech bubble, the score note, and its handwritten name. Bottom (thumb
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

  const bubble = takenToday ? AFTER_TEST : reunion ? REUNION : GREETING[timeOfDay(now)];

  const share = () => {
    if (!latest) return;
    sharing.shareText(`My Noggin Score today: ${latest.nogginScore}. ${profile.nogginName} says hi! Grow Your Noggin.`);
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
            <SpeechBubble text={bubble} tail="bottom-right" style={{ marginBottom: 4, maxWidth: 190 }} />
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
              <Pen size={28} style={{ lineHeight: 34 }} numberOfLines={1}>{profile.nogginName}</Pen>
              <GridRule width={160} />
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
