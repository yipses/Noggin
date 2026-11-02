import { View } from 'react-native';
import { color, size } from './theme';

/** Thin progress bar. No visible timer; this gives a sense of pace. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={{ height: 8, borderRadius: 4, borderWidth: size.lineWeightUi, borderColor: color.ink, backgroundColor: '#FFFFFF', overflow: 'hidden', flex: 1 }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: color.accent }} />
    </View>
  );
}

