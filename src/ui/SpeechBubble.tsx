import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Printed } from './text';
import { color, size } from './theme';

interface Props {
  text: string;
  /** Which way the tail points (toward the noggin). */
  tail?: 'bottom-left' | 'bottom-right' | 'left' | 'bottom';
  style?: StyleProp<ViewStyle>;
  textSize?: number;
}

/** White, charcoal outline, rounded, small tail toward the noggin. A few words only. Printed. */
export function SpeechBubble({ text, tail = 'bottom-right', style, textSize = 17 }: Props) {
  const tailStyle: ViewStyle =
    tail === 'left'
      ? { position: 'absolute', left: -11, top: '50%', marginTop: -8 }
      : tail === 'bottom-left'
        ? { position: 'absolute', left: 22, bottom: -11 }
        : tail === 'bottom'
          ? { position: 'absolute', left: '50%', marginLeft: -8, bottom: -11 }
          : { position: 'absolute', right: 26, bottom: -11 };
  const rotate = tail === 'left' ? '90deg' : '0deg';
  const flip = tail === 'bottom-right' ? -1 : 1;
  return (
    <View style={[{ alignSelf: 'flex-start' }, style]}>
      <View
        style={{
          backgroundColor: '#FFFFFF', borderColor: color.ink, borderWidth: size.lineWeightUi, borderRadius: 18,
          paddingHorizontal: 16, paddingVertical: 9,
        }}
      >
        <Printed size={textSize} weight="medium">{text}</Printed>
      </View>
      <View style={[tailStyle, { transform: [{ rotate }, { scaleX: flip }] }]} pointerEvents="none">
        <Svg width={16} height={13} viewBox="0 0 16 13">
          <Path d="M0.5 0.5 L4 12 L15.5 0.5" fill="#FFFFFF" stroke={color.ink} strokeWidth={size.lineWeightUi} strokeLinejoin="round" />
          <Path d="M1.6 0 H14.6" stroke="#FFFFFF" strokeWidth={2.4} />
        </Svg>
      </View>
    </View>
  );
}
