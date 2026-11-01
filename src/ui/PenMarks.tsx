import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { color } from './theme';

/** Quick pop-in for pen marks. Has to be very quick or it slows a 20 question drill. */
function usePop(duration = 110) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [v, duration]);
  return {
    opacity: v,
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
  };
}

/** A hand-drawn pen circle around whatever it overlays. Fills its parent. */
export function PenCircle({ inset = -6, style }: { inset?: number; style?: ViewStyle }) {
  const pop = usePop();
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { top: inset, bottom: inset, left: inset, right: inset }, pop, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path
          d="M62 6 C30 2 6 18 6 50 C6 80 30 95 54 94 C80 93 95 75 94 48 C93 22 74 7 46 9"
          fill="none"
          stroke={color.pen}
          strokeWidth={3.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </Svg>
    </Animated.View>
  );
}

/** A quick pen strike-through, slightly off level. */
export function PenStrike({ style }: { style?: ViewStyle }) {
  const pop = usePop(90);
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, pop, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d="M14 62 C38 54 62 46 86 38" fill="none" stroke={color.pen} strokeWidth={3.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </Svg>
    </Animated.View>
  );
}

/** Wraps handwritten text so it appears with the same quick pop. */
export function PenPop({ children }: { children: React.ReactNode }) {
  const pop = usePop(120);
  return <Animated.View style={pop}>{children}</Animated.View>;
}
