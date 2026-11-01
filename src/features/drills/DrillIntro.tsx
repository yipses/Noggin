import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DRILLS } from '../../core/drills';
import { DrillId } from '../../core/norms';
import { Button, IconButton } from '../../ui/Button';
import { CloseIcon } from '../../ui/icons';
import { Noggin } from '../../ui/Noggin';
import { PenCircle } from '../../ui/PenMarks';
import { SpeechBubble } from '../../ui/SpeechBubble';
import { Label, Printed } from '../../ui/text';
import { color, size } from '../../ui/theme';

interface Props {
  drillId: DrillId;
  /** "drill 1 of 2" in the daily test; "training" otherwise. */
  caption: string;
  showPractice: boolean;
  tip?: string;
  onStart: () => void;
  onPractice: () => void;
  onClose: () => void;
}

/** Untimed instructions before each drill, so the score reflects the drill, not learning the controls. */
export function DrillIntro({ drillId, caption, showPractice, tip, onStart, onPractice, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const info = DRILLS[drillId];
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row' }}>
        <IconButton label="Close" onPress={onClose}>
          <CloseIcon />
        </IconButton>
      </View>
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Label size={13}>{caption}</Label>
        <Printed weight="bold" size={32} style={{ marginTop: 4 }} accessibilityRole="header">{info.name}</Printed>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        {drillId === 'highsLows' ? <HighsLowsExample /> : <QuickSumsExample />}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 }}>
        <Noggin width={96} expression="calm" />
        <SpeechBubble text={tip ?? info.tip} tail="bottom-left" style={{ marginLeft: -4, marginBottom: 56, flexShrink: 1 }} />
      </View>

      <Button title="Start" onPress={onStart} testID="drill-start" />
      {showPractice && (
        <Button title="Practice first" variant="secondary" onPress={onPractice} style={{ marginTop: 12 }} note="untimed" />
      )}
    </View>
  );
}

function Card({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Label size={12} style={{ marginBottom: 8 }}>{label}</Label>
      <View
        style={{
          width: '100%', height: 132, borderRadius: size.radiusCard, borderWidth: size.lineWeightUi, borderColor: color.ink,
          backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Num({ n, s, circled }: { n: number; s: number; circled?: boolean }) {
  return (
    <View style={{ paddingHorizontal: 6 }}>
      <Printed weight="bold" size={s} style={{ lineHeight: s * 1.15 }}>{n}</Printed>
      {circled && <PenCircle inset={-8} />}
    </View>
  );
}

function HighsLowsExample() {
  return (
    <View style={{ flexDirection: 'row', gap: 14 }}>
      <Card label="tap the highest">
        <Num n={3} s={72} />
        <Num n={8} s={30} circled />
      </Card>
      <Card label="tap the lowest">
        <Num n={9} s={30} />
        <Num n={4} s={72} circled />
      </Card>
    </View>
  );
}

function QuickSumsExample() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Printed weight="bold" size={44}>3 + 4</Printed>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 220, gap: 10, marginTop: 16, justifyContent: 'center' }}>
        {[7, 6, 8, 17].map((c) => (
          <View
            key={c}
            style={{
              width: 100, height: 52, borderRadius: 14, borderWidth: size.lineWeightUi, borderBottomWidth: 3, borderColor: color.ink,
              backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <View>
              <Printed weight="bold" size={24}>{c}</Printed>
              {c === 7 && <PenCircle inset={-8} style={{ left: -14, right: -14 }} />}
            </View>
          </View>
        ))}
      </View>
      <Label size={12} style={{ marginTop: 14 }}>tap the right answer to go on</Label>
    </View>
  );
}
