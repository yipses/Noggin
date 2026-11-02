import { ComponentRef, useEffect, useMemo, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, ScrollView, View } from 'react-native';
import { haptics } from '../services';
import { Pen } from './text';
import { color, size } from './theme';

const ITEM = 40; // two dot rows per year
const VISIBLE = 5; // odd, so one year sits in the middle

interface Props {
  from: number;
  to: number;
  value: number;
  onChange: (year: number) => void;
}

/**
 * A scroll wheel for picking a year. The chosen year is the player's, so it
 * is in pen; the others fade. Tap a year or flick to it. Works the same on
 * web and phones (no native picker needed).
 */
export function YearWheel({ from, to, value, onChange }: Props) {
  const years = useMemo(() => Array.from({ length: to - from + 1 }, (_, i) => to - i), [from, to]);
  const ref = useRef<ComponentRef<typeof ScrollView>>(null);
  const last = useRef(value);

  const indexOf = (y: number) => Math.max(0, Math.min(years.length - 1, years.indexOf(y)));

  useEffect(() => {
    // Start on the current value without animating.
    const t = setTimeout(() => ref.current?.scrollTo({ y: indexOf(value) * ITEM, animated: false }), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When scrolling stops, settle exactly onto the nearest year. Phones snap
  // natively; this also covers browsers and any scroll that ends between rows.
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (settle.current) clearTimeout(settle.current);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    const i = Math.max(0, Math.min(years.length - 1, Math.round(offset / ITEM)));
    const y = years[i];
    if (y !== last.current) {
      last.current = y;
      haptics.tap();
      onChange(y);
    }
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (Math.abs(offset - i * ITEM) > 0.5) ref.current?.scrollTo({ y: i * ITEM, animated: true });
    }, 140);
  };

  const pad = ((VISIBLE - 1) / 2) * ITEM;

  return (
    <View style={{ height: ITEM * VISIBLE, width: 200, alignSelf: 'center' }}>
      {/* The printed selection band */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', left: 0, right: 0, top: pad, height: ITEM,
          borderTopWidth: size.lineWeightUi, borderBottomWidth: size.lineWeightUi, borderColor: color.ink,
        }}
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: pad }}
        // Browsers ignore snapToInterval; CSS scroll snapping does the same job.
        style={Platform.OS === 'web' ? ({ scrollSnapType: 'y mandatory' } as object) : undefined}
        accessibilityLabel="Birth year"
        accessibilityHint="Scroll to choose your birth year"
      >
        {years.map((y) => {
          const selected = y === value;
          return (
            <Pressable
              key={y}
              accessibilityRole="button"
              accessibilityLabel={String(y)}
              accessibilityState={{ selected }}
              onPress={() => ref.current?.scrollTo({ y: indexOf(y) * ITEM, animated: true })}
              style={[
                { height: ITEM, alignItems: 'center', justifyContent: 'center' },
                Platform.OS === 'web' ? ({ scrollSnapAlign: 'center' } as object) : null,
              ]}
            >
              <Pen size={selected ? 30 : 22} colour={selected ? color.pen : color.inkMuted} style={{ lineHeight: ITEM, opacity: selected ? 1 : 0.45 }}>
                {y}
              </Pen>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
