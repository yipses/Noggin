import { ComponentRef, useCallback, useEffect, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { color, grid, size, snap } from './theme';

interface Props {
  /** Desired width; the drawn line is snapped so it starts and ends on a dot. */
  width: number;
  style?: StyleProp<ViewStyle>;
  stroke?: string;
}

/**
 * A printed rule (answer line, name line) that runs exactly through a row of
 * dots and starts and ends on a dot. It measures where it sits in the window,
 * then shifts its stroke onto the nearest dot row and dot columns.
 * Occupies a fixed 20 pt tall box so layouts don't jump.
 */
export function GridRule({ width, style, stroke = color.ink }: Props) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const [geo, setGeo] = useState<{ dy: number; x0: number; x1: number } | null>(null);

  const measure = useCallback(() => {
    ref.current?.measureInWindow((x: number, y: number, w: number) => {
      if (w === 0 && x === 0 && y === 0) return;
      const mid = y + grid.dotSpacing / 2;
      const dy = snap(mid) - y;
      const x0 = snap(x) - x;
      const x1 = snap(x + w) - x;
      setGeo((g) => (g && g.dy === dy && g.x0 === x0 && g.x1 === x1 ? g : { dy, x0, x1 }));
    });
  }, []);

  // Measure on layout, and again once any screen transition has settled.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const onLayout = useCallback(() => {
    measure();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(measure, 450);
  }, [measure]);

  return (
    <View ref={ref} onLayout={onLayout} style={[{ width, height: grid.dotSpacing, overflow: 'visible' }, style]}>
      {geo && (
        <Svg
          width={width + grid.dotSpacing * 2}
          height={grid.dotSpacing * 2}
          style={{ position: 'absolute', left: -grid.dotSpacing, top: -grid.dotSpacing / 2 }}
          pointerEvents="none"
        >
          <Line
            x1={geo.x0 + grid.dotSpacing}
            x2={geo.x1 + grid.dotSpacing}
            y1={geo.dy + grid.dotSpacing / 2}
            y2={geo.dy + grid.dotSpacing / 2}
            stroke={stroke}
            strokeWidth={size.lineWeightUi}
            strokeLinecap="round"
          />
        </Svg>
      )}
    </View>
  );
}
