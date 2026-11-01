import { Text, TextProps, TextStyle } from 'react-native';
import { color, font } from './theme';

type P = TextProps & { size?: number; colour?: string; weight?: 'bold' | 'medium' | 'regular'; align?: TextStyle['textAlign'] };

/** Anything the app says: printed. */
export function Printed({ size = 17, colour = color.ink, weight = 'medium', align, style, ...rest }: P) {
  const family = weight === 'bold' ? font.display : weight === 'medium' ? font.displayMedium : font.body;
  return <Text {...rest} style={[{ fontFamily: family, fontSize: size, color: colour, textAlign: align }, style]} />;
}

/** Small monospace labels ("drill 1 of 2", "noggin score"). */
export function Label({ size = 12, colour = color.inkMuted, weight, align, style, ...rest }: P) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: weight === 'bold' || weight === 'medium' ? font.labelMedium : font.label, fontSize: size, color: colour, letterSpacing: 0.5, textAlign: align }, style]}
    />
  );
}

/** Anything that's the player's: handwritten in their pen. Short things only. */
export function Pen({ size = 28, colour = color.pen, align, style, ...rest }: P) {
  return <Text {...rest} style={[{ fontFamily: font.pen, fontSize: size, color: colour, textAlign: align }, style]} />;
}
