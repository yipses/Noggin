import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Label, Printed } from './text';
import { color, size } from './theme';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  /** Small trailing note, e.g. "5 min". */
  note?: string;
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Primary: charcoal pill, white text, 56 pt. Secondary: white with charcoal outline. */
export function Button({ title, onPress, variant = 'primary', note, icon, disabled, style, testID }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        disabled && { opacity: 0.45 },
        pressed && { transform: [{ translateY: 1 }], opacity: 0.9 },
        style,
      ]}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      <Printed weight="bold" size={18} colour={primary ? '#FFFFFF' : color.ink}>
        {title}
      </Printed>
      {note && (
        <Label size={12} colour={primary ? '#D8D0C8' : color.inkMuted} style={{ marginLeft: 10 }}>
          {note}
        </Label>
      )}
    </Pressable>
  );
}

/** Round icon button, at least 44 pt. */
export function IconButton({ onPress, children, label, size: s = 44, filled = false }: { onPress?: () => void; children: ReactNode; label: string; size?: number; filled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        {
          width: s, height: s, borderRadius: s / 2, alignItems: 'center', justifyContent: 'center',
          backgroundColor: filled ? color.ink : '#FFFFFF', borderWidth: size.lineWeightUi, borderColor: color.ink,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: size.buttonPrimaryHeight,
    borderRadius: size.radiusButton,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: color.ink },
  secondary: { backgroundColor: '#FFFFFF', borderWidth: size.lineWeightUi, borderColor: color.ink },
});
