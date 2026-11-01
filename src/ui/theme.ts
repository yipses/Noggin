import tokens from '../../design/tokens.json';

export const color = tokens.color;
export const nogginColor = tokens.noggin;
export const size = {
  ...tokens.size,
  screenWidth: tokens.size.screen[0],
  screenHeight: tokens.size.screen[1],
};
export const grid = tokens.grid;

/**
 * Loaded font family names (see src/app/_layout.tsx).
 * display: printed headings and buttons. label: small monospace labels.
 * pen: the player's handwriting (Klee One). Handwriting is for short things
 * only (names, numbers); anything longer stays printed.
 */
export const font = {
  display: 'MPLUSRounded1c_700Bold',
  displayMedium: 'MPLUSRounded1c_500Medium',
  body: 'MPLUSRounded1c_400Regular',
  label: 'DMMono_400Regular',
  labelMedium: 'DMMono_500Medium',
  pen: 'KleeOne_600SemiBold',
  penLight: 'KleeOne_400Regular',
};

/** Snap a coordinate to the nearest dot (dots sit at 10 + 20n). */
export function snap(v: number): number {
  return grid.dotOffset + grid.dotSpacing * Math.round((v - grid.dotOffset) / grid.dotSpacing);
}
