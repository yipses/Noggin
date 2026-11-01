import { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { color, grid } from './theme';

/**
 * Warm paper with a faint dot every 20 pt. The paper fills the window and its
 * dots are anchored to the window's top-left, so window coordinates are paper
 * coordinates (GridRule relies on this to land printed lines on the dots).
 */
export function Paper({ children }: { children?: ReactNode }) {
  const { width, height } = useWindowDimensions();
  return (
    <View style={styles.paper}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id="dots" x={0} y={0} width={grid.dotSpacing} height={grid.dotSpacing} patternUnits="userSpaceOnUse">
            <Circle cx={grid.dotOffset} cy={grid.dotOffset} r={1.1} fill={color.paperDot} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#dots)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { flex: 1, backgroundColor: color.paper },
});
