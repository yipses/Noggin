import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { color } from './theme';

/** A small white note, slightly rotated, held on by a strip of tape. */
export function TapedNote({ children, rotate = 3, style, width = 128 }: { children: ReactNode; rotate?: number; style?: StyleProp<ViewStyle>; width?: number }) {
  return (
    <View style={[{ width, transform: [{ rotate: `${rotate}deg` }] }, style]}>
      <View
        style={{
          backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingTop: 16, paddingBottom: 12, alignItems: 'center',
          shadowColor: color.ink, shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1.5 }, elevation: 2,
        }}
      >
        {children}
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: -9, left: width / 2 - 28, width: 56, height: 18,
          backgroundColor: 'rgba(237, 190, 90, 0.45)', transform: [{ rotate: '-4deg' }],
        }}
      />
    </View>
  );
}
