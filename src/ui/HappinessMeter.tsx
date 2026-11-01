import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';
import { GiftIcon, HeartIcon } from './icons';
import { color, size } from './theme';

interface Props {
  /** 0 to 1. */
  level: number;
  /** Where the next action would take the meter (striped preview), 0 to 1. */
  previewTo?: number;
  /** The gift lights up when the preview reaches it. */
  giftLit?: boolean;
}

/**
 * Happiness as icons only: a heart, the meter, a gift at the end. No label.
 * The preview uses a stripe pattern as well as colour.
 */
export function HappinessMeter({ level, previewTo, giftLit }: Props) {
  const [w, setW] = useState(0);
  const h = 18;
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  const fillW = Math.max(0, Math.min(1, level)) * w;
  const prevW = previewTo !== undefined ? Math.max(0, Math.min(1, previewTo)) * w : fillW;
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center' }}
      accessibilityRole="progressbar"
      accessibilityLabel="Happiness"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(level * 100) }}
    >
      <HeartIcon size={26} />
      <View style={{ flex: 1, marginHorizontal: 10, height: h }} onLayout={onLayout}>
        {w > 0 && (
          <Svg width={w} height={h}>
            <Defs>
              <Pattern id="stripes" width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <Rect width={8} height={8} fill={color.meterPreviewB} />
                <Line x1={0} y1={0} x2={0} y2={8} stroke={color.meterPreviewA} strokeWidth={6} />
              </Pattern>
            </Defs>
            <Rect x={0.75} y={0.75} width={w - 1.5} height={h - 1.5} rx={(h - 1.5) / 2} fill={color.meterTrack} />
            {prevW > fillW && <Rect x={0.75} y={0.75} width={Math.max(0, prevW - 1.5)} height={h - 1.5} rx={(h - 1.5) / 2} fill="url(#stripes)" />}
            {fillW > 0 && <Rect x={0.75} y={0.75} width={Math.max(h - 1.5, fillW - 1.5)} height={h - 1.5} rx={(h - 1.5) / 2} fill={color.accent} />}
            <Rect x={0.75} y={0.75} width={w - 1.5} height={h - 1.5} rx={(h - 1.5) / 2} fill="none" stroke={color.ink} strokeWidth={size.lineWeightUi} />
          </Svg>
        )}
      </View>
      <GiftIcon size={30} lit={giftLit} />
    </View>
  );
}
