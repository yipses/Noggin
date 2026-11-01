import { ReactNode } from 'react';
import { View } from 'react-native';
import { color } from './theme';

/** A mustard highlighter swipe behind a key word. */
export function Highlighter({ children }: { children: ReactNode }) {
  return (
    <View style={{ alignSelf: 'center' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', left: -8, right: -8, top: '38%', bottom: '4%',
          backgroundColor: color.accent, opacity: 0.75, borderRadius: 4,
          transform: [{ rotate: '-1.5deg' }, { skewX: '-8deg' }],
        }}
      />
      {children}
    </View>
  );
}
