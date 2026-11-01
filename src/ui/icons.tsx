import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { color } from './theme';

type P = { size?: number; colour?: string };

export function HeartIcon({ size = 24, colour = color.heart }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 20.5 C6 16.4 3 13.2 3 9.4 C3 6.6 5.1 4.6 7.6 4.6 C9.4 4.6 10.9 5.6 12 7.2 C13.1 5.6 14.6 4.6 16.4 4.6 C18.9 4.6 21 6.6 21 9.4 C21 13.2 18 16.4 12 20.5 Z"
        fill={colour}
        stroke={color.ink}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GiftIcon({ size = 26, lit = false }: P & { lit?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      {lit && <Circle cx={13} cy={14} r={12.5} fill={color.giftLit} />}
      <Rect x={5} y={11} width={16} height={11} rx={2} fill={lit ? color.accent : '#FFFFFF'} stroke={color.ink} strokeWidth={1.5} />
      <Rect x={4} y={8} width={18} height={4.5} rx={1.5} fill={lit ? color.accent : '#FFFFFF'} stroke={color.ink} strokeWidth={1.5} />
      <Path d="M13 8 V22" stroke={color.ink} strokeWidth={1.5} />
      <Path d="M13 8 C10.5 3.5 6.5 4.8 8.6 8 M13 8 C15.5 3.5 19.5 4.8 17.4 8" fill="none" stroke={color.ink} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 18, colour = color.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path d="M4 4 L14 14 M14 4 L4 14" stroke={colour} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ArrowIcon({ size = 26, up = true, colour = color.ink }: P & { up?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" style={{ transform: [{ rotate: up ? '0deg' : '180deg' }] }}>
      <Path d="M13 22 V5 M6 11.5 L13 4.5 L20 11.5" fill="none" stroke={colour} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ProfileIcon({ size = 22, colour = color.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Circle cx={11} cy={8} r={4} fill="none" stroke={colour} strokeWidth={1.6} />
      <Path d="M3.5 19.5 C4.5 15 7.5 13.5 11 13.5 C14.5 13.5 17.5 15 18.5 19.5" fill="none" stroke={colour} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 22, colour = color.ink }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Path d="M11 14 V3 M6.5 7 L11 2.5 L15.5 7" fill="none" stroke={colour} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 10.5 H4 V19.5 H18 V10.5 H17" fill="none" stroke={colour} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export type TabIconName = 'today' | 'drills' | 'closet' | 'me';

export function TabIcon({ name, size = 24, colour = color.ink }: P & { name: TabIconName }) {
  const s = { fill: 'none', stroke: colour, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'today' && (
        <>
          <Circle cx={12} cy={12} r={4.5} {...s} />
          <Path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M5.3 18.7 L7 17 M17 7 L18.7 5.3" {...s} />
        </>
      )}
      {name === 'drills' && (
        <>
          <Rect x={4} y={3} width={16} height={18} rx={2.5} {...s} />
          <Path d="M8 8 H16 M8 12 H16 M8 16 H13" {...s} />
        </>
      )}
      {name === 'closet' && <Path d="M12 6 C12 4 15 4 15 6 C15 7.5 12 8 12 9.5 L3.5 16.5 C3 17 3.3 18 4 18 H20 C20.7 18 21 17 20.5 16.5 L12 9.5" {...s} />}
      {name === 'me' && (
        <>
          <Circle cx={12} cy={8.5} r={4} {...s} />
          <Path d="M4.5 20.5 C5.5 16 8.5 14.5 12 14.5 C15.5 14.5 18.5 16 19.5 20.5" {...s} />
        </>
      )}
    </Svg>
  );
}
