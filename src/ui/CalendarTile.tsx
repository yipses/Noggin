import { Pressable, View } from 'react-native';
import { Label, Pen } from './text';
import { color, size } from './theme';

/** A small desk calendar: mustard header with the month, days trained in pen, "trained". */
export function CalendarTile({ month, days, onPress }: { month: string; days: number; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${days} days trained this month. Open calendar`}
      style={({ pressed }) => [
        {
          width: 64, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF',
          borderWidth: size.lineWeightUi, borderColor: color.ink,
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={{ backgroundColor: color.accent, paddingVertical: 2, borderBottomWidth: size.lineWeightUi, borderColor: color.ink }}>
        <Label size={11} weight="medium" colour={color.ink} align="center">{month}</Label>
      </View>
      {/* Klee One sits its digits low in the line box, so the box is pulled up
          and given room below to keep the gaps above and below the number even. */}
      <Pen size={28} align="center" style={{ lineHeight: 30, marginTop: 0 }}>{days}</Pen>
      <Label size={9.5} align="center" style={{ marginTop: 3, marginBottom: 6 }}>trained</Label>
    </Pressable>
  );
}
