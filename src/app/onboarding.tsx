import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FIRST_MEET } from '../core/copy';
import { useApp } from '../state/AppState';
import { Button } from '../ui/Button';
import { GridRule } from '../ui/GridRule';
import { Noggin } from '../ui/Noggin';
import { Paper } from '../ui/Paper';
import { SpeechBubble } from '../ui/SpeechBubble';
import { Label, Printed } from '../ui/text';
import { color, font } from '../ui/theme';
import { Expression } from '../ui/noggin/nogginArt';

type Step = 'meet' | 'name' | 'birth' | 'ready';

/**
 * First launch: meet your noggin, name it, learn that the app helps keep it
 * happy, give your birth year, then take a quick test. No account first.
 */
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { createProfile } = useApp();
  const [step, setStep] = useState<Step>('meet');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const thisYear = new Date().getFullYear();
  const yearNum = Number(year);
  const yearOk = /^\d{4}$/.test(year) && yearNum >= thisYear - 110 && yearNum <= thisYear;
  const nameOk = name.trim().length > 0;

  const scene: Record<Step, { bubble: string; expression: Expression }> = {
    meet: { bubble: FIRST_MEET, expression: 'calm' },
    name: { bubble: 'What should we call me?', expression: 'calm' },
    birth: { bubble: `Hi! I'm ${name.trim() || 'your noggin'}!`, expression: 'happy' },
    ready: { bubble: "Let's play!", expression: 'happy' },
  };

  return (
    <Paper>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SpeechBubble text={scene[step].bubble} tail="bottom" style={{ alignSelf: 'center', marginBottom: 16 }} />
            <Noggin width={step === 'meet' ? 240 : 190} expression={scene[step].expression} />
          </View>

          {step === 'meet' && (
            <View>
              <Printed size={19} align="center" style={{ marginBottom: 6 }}>Every day you play, your noggin gets a little happier.</Printed>
              <Printed size={15} weight="regular" align="center" colour={color.inkMuted} style={{ marginBottom: 24 }}>
                A few minutes a day keeps it smiling.
              </Printed>
              <Button title="Hi there!" onPress={() => setStep('name')} />
            </View>
          )}

          {step === 'name' && (
            <View>
              <Label size={12} align="center">name your noggin</Label>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <PenInput value={name} onChangeText={setName} placeholder="Mochi" maxLength={16} autoFocus onSubmit={() => nameOk && setStep('birth')} />
                <GridRule width={220} />
              </View>
              <Button title="That's me!" disabled={!nameOk} onPress={() => setStep('birth')} />
            </View>
          )}

          {step === 'birth' && (
            <View>
              <Printed size={18} align="center">What year were you born?</Printed>
              <Printed size={14} weight="regular" align="center" colour={color.inkMuted} style={{ marginTop: 4 }}>
                So we can compare your score with people your age.
              </Printed>
              <View style={{ alignItems: 'center', marginVertical: 18 }}>
                <PenInput value={year} onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))} placeholder="1990" keyboardType="number-pad" maxLength={4} autoFocus onSubmit={() => yearOk && setStep('ready')} />
                <GridRule width={140} />
              </View>
              <Button title="Next" disabled={!yearOk} onPress={() => setStep('ready')} />
            </View>
          )}

          {step === 'ready' && (
            <View>
              <Printed size={19} align="center">Let's find your starting point.</Printed>
              <Printed size={15} weight="regular" align="center" colour={color.inkMuted} style={{ marginTop: 4, marginBottom: 24 }}>
                Two quick drills. Take your time with the instructions.
              </Printed>
              <Button
                title="Start my first test"
                testID="first-test"
                onPress={() => {
                  createProfile(name, yearNum);
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
  keyboardType?: 'number-pad'; autoFocus?: boolean; onSubmit: () => void;
}) {
  return (
    <TextInput
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      placeholderTextColor={color.paperDot}
      maxLength={props.maxLength}
      keyboardType={props.keyboardType}
      autoFocus={props.autoFocus}
      onSubmitEditing={props.onSubmit}
      returnKeyType="done"
      autoCorrect={false}
      autoCapitalize="words"
      style={[
        { fontFamily: font.pen, fontSize: 34, color: color.pen, textAlign: 'center', minWidth: 200, paddingVertical: 2, height: 52, borderWidth: 0 },
        // Web draws a focus outline and border on inputs; the paper line is the field.
        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
      ]}
    />
  );
}
