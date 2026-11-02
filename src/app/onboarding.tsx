import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ASK_NAME, FIRST_MEET, ONBOARD_INTRO, drillsLine } from '../core/copy';
import { DAILY_TEST } from '../core/drills';
import { useApp } from '../state/AppState';
import { Button } from '../ui/Button';
import { GridRule } from '../ui/GridRule';
import { Noggin } from '../ui/Noggin';
import { Paper } from '../ui/Paper';
import { SpeechBubble } from '../ui/SpeechBubble';
import { Label, Printed } from '../ui/text';
import { color, font } from '../ui/theme';
import { YearWheel } from '../ui/YearWheel';
import { Expression } from '../ui/noggin/nogginArt';

type Step = 'meet' | 'name' | 'birth' | 'ready';

export const DEFAULT_BIRTH_YEAR = 1990;

/**
 * First launch: meet your noggin, tell it your name, give your birth year,
 * then take a quick test. No account first (design.md section 3).
 */
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { createProfile } = useApp();
  const [step, setStep] = useState<Step>('meet');
  const [name, setName] = useState('');
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(DEFAULT_BIRTH_YEAR);
  const nameOk = name.trim().length > 0;
  const first = name.trim();

  const scene: Record<Step, { bubble: string; expression: Expression; width: number }> = {
    meet: { bubble: FIRST_MEET, expression: 'calm', width: 240 },
    name: { bubble: ASK_NAME, expression: 'calm', width: 190 },
    birth: { bubble: `Hi, ${first}!`, expression: 'happy', width: 140 },
    ready: { bubble: "Let's play!", expression: 'happy', width: 190 },
  };

  return (
    <Paper>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SpeechBubble text={scene[step].bubble} tail="bottom" style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Noggin width={scene[step].width} expression={scene[step].expression} />
          </View>

          {step === 'meet' && (
            <View>
              <Printed size={19} align="center" style={{ marginBottom: 24 }}>{ONBOARD_INTRO}</Printed>
              <Button title="Let's go!" onPress={() => setStep('name')} />
            </View>
          )}

          {step === 'name' && (
            <View>
              <Label size={12} align="center">your name</Label>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <PenInput value={name} onChangeText={setName} placeholder="Alex" maxLength={20} autoFocus onSubmit={() => nameOk && setStep('birth')} />
                <GridRule width={220} />
              </View>
              <Button title="Next" disabled={!nameOk} onPress={() => setStep('birth')} />
            </View>
          )}

          {step === 'birth' && (
            <View>
              <Printed size={18} align="center">What year were you born?</Printed>
              <Printed size={14} weight="regular" align="center" colour={color.inkMuted} style={{ marginTop: 4 }}>
                So we can compare your score with people your age.
              </Printed>
              <View style={{ marginVertical: 14 }}>
                <YearWheel from={thisYear - 100} to={thisYear} value={year} onChange={setYear} />
              </View>
              <Button title="Next" onPress={() => setStep('ready')} />
            </View>
          )}

          {step === 'ready' && (
            <View>
              <Printed size={19} align="center">Let's find your starting point.</Printed>
              <Printed size={15} weight="regular" align="center" colour={color.inkMuted} style={{ marginTop: 4, marginBottom: 24 }}>
                {drillsLine(DAILY_TEST.length)}
              </Printed>
              <Button
                title="Start my first test"
                testID="first-test"
                onPress={() => {
                  createProfile(first, year);
                  router.replace('/test');
                }}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Paper>
  );
}

/** Text the player writes: shown in their pen. */
function PenInput(props: {
  value: string; onChangeText: (t: string) => void; placeholder: string; maxLength: number;
  autoFocus?: boolean; onSubmit: () => void;
}) {
  return (
    <TextInput
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      placeholderTextColor={color.paperDot}
      maxLength={props.maxLength}
      autoFocus={props.autoFocus}
      onSubmitEditing={props.onSubmit}
      returnKeyType="done"
      autoCorrect={false}
      autoCapitalize="words"
      autoComplete="given-name"
      style={[
        { fontFamily: font.pen, fontSize: 34, color: color.pen, textAlign: 'center', minWidth: 200, paddingVertical: 2, height: 52, borderWidth: 0 },
        // Web draws a focus outline and border on inputs; the paper line is the field.
        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
      ]}
    />
  );
}
