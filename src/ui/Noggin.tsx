import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';
import { NOGGIN_SVG, NOGGIN_VIEWBOX, Expression } from './noggin/nogginArt';
import { color } from './theme';

interface Props {
  expression?: Expression;
  /** Rendered width in pt; height follows the art's aspect ratio. */
  width: number;
  /** Small ink sparkle doodles around it (home screen, after training). */
  sparkles?: boolean;
}

const ASPECT = NOGGIN_VIEWBOX.height / NOGGIN_VIEWBOX.width;

/** The player's noggin. Art is generated from design/noggin/noggin.py. */
export const Noggin = memo(function Noggin({ expression = 'calm', width, sparkles }: Props) {
  const height = width * ASPECT;
  return (
    <View style={{ width, height }} accessibilityRole="image" accessibilityLabel={`Your noggin, ${expression}`}>
      <SvgXml xml={NOGGIN_SVG[expression]} width={width} height={height} />
      {sparkles && <Sparkles width={width} height={height} />}
    </View>
  );
});

/** Four-point ink sparkles: thin doodles, not glitter. */
function Sparkles({ width, height }: { width: number; height: number }) {
  // Positions as fractions of the noggin box; the doodle layer extends past
  // the box so sparkles sit in the air around the body, never on its outline.
  const spots = [
    { x: 0.02, y: 0.08, s: 1 },
    { x: 0.96, y: 0.02, s: 0.8 },
    { x: 1.06, y: 0.42, s: 0.6 },
    { x: -0.07, y: 0.5, s: 0.55 },
  ];
  const pad = width * 0.15;
  return (
    <Svg width={width + pad * 2} height={height + pad} style={{ position: 'absolute', left: -pad, top: -pad }} pointerEvents="none">
      {spots.map((p, i) => {
        const cx = pad + p.x * width;
        const cy = pad + p.y * height;
        const r = 9 * p.s * (width / 220);
        const k = r * 0.22;
        return (
          <Path
            key={i}
            d={`M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r} Z`}
            fill="none"
            stroke={color.ink}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        );
      })}
    </Svg>
  );
}
