import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DRILLS } from '../../core/drills';
import { Paper } from '../../ui/Paper';
import { Label, Printed } from '../../ui/text';
import { color, size } from '../../ui/theme';

/** Optional training. Prototype: the two built drills, plus what's coming. */
export default function Drills() {
  const insets = useSafeAreaInsets();
  const all = Object.values(DRILLS);
  return (
    <Paper>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 30 }}>
        <Label size={13}>training</Label>
        <Printed weight="bold" size={28} style={{ marginBottom: 16 }}>Drills</Printed>
        {all.map((d) => (
          <Pressable
            key={d.id}
            disabled={!d.built}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/practice/[drill]', params: { drill: d.id } })}
            style={({ pressed }) => [
              {
                backgroundColor: '#FFFFFF', borderRadius: size.radiusCard, borderWidth: size.lineWeightUi,
                borderBottomWidth: d.built ? 4 : size.lineWeightUi, borderColor: d.built ? color.ink : color.rule,
                padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
              },
              pressed && { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Printed weight="bold" size={19} colour={d.built ? color.ink : color.inkMuted}>{d.name}</Printed>
              <Printed weight="regular" size={14} colour={color.inkMuted} style={{ marginTop: 2 }}>{d.blurb}</Printed>
            </View>
            <Label size={11}>{d.built ? 'play' : 'soon'}</Label>
          </Pressable>
        ))}
      </ScrollView>
    </Paper>
  );
}
