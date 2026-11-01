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

/** One dot per drill in today's test. */
export function ProgressDots({ total, done }: { total: number; done: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }} accessibilityLabel={`${done} of ${total} drills done`}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: 12, height: 12, borderRadius: 6, borderWidth: size.lineWeightUi, borderColor: color.ink,
            backgroundColor: i < done ? color.accent : '#FFFFFF',
          }}
        />
      ))}
    </View>
  );
}
