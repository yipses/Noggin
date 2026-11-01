import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { daysInMonth, monthName, monthOf, parseDayKey, weekdayOf } from '../core/day';
import { daysTrainedInMonth, recordFor } from '../core/progress';
import { useApp } from '../state/AppState';
import { IconButton } from '../ui/Button';
import { ArrowIcon, CloseIcon } from '../ui/icons';
import { Paper } from '../ui/Paper';
import { Label, Pen, Printed } from '../ui/text';
import { color, size } from '../ui/theme';

const pad = (n: number) => String(n).padStart(2, '0');

/** The full calendar: a monthly running total, stamped days. Missed days are just blank. */
export default function Calendar() {
  const insets = useSafeAreaInsets();
  const { data, today } = useApp();
  const t = parseDayKey(today);
  const [ym, setYm] = useState({ year: t.year, month: t.month });
  const key = `${ym.year}-${pad(ym.month)}`;
  const first = `${key}-01`;
  const total = daysTrainedInMonth(data.history, key);
  const lead = weekdayOf(first);
  const n = daysInMonth(ym.year, ym.month);
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
  const isCurrent = key === monthOf(today);

  const shift = (d: number) => {
    const m = ym.month + d;
    setYm(m < 1 ? { year: ym.year - 1, month: 12 } : m > 12 ? { year: ym.year + 1, month: 1 } : { year: ym.year, month: m });
  };

  return (
    <Paper>
      <View style={{ flex: 1, paddingTop: insets.top + 8, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <IconButton label="Close" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
            <CloseIcon />
          </IconButton>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <IconButton label="Previous month" onPress={() => shift(-1)}>
            <View style={{ transform: [{ rotate: '-90deg' }] }}><ArrowIcon size={20} /></View>
          </IconButton>
          <Printed weight="bold" size={24}>{monthName(first)} {ym.year}</Printed>
          <IconButton label="Next month" onPress={() => shift(1)}>
            <View style={{ transform: [{ rotate: '90deg' }] }}><ArrowIcon size={20} /></View>
          </IconButton>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginTop: 10 }}>
          <Pen size={40}>{total}</Pen>
          <Printed size={17}>{total === 1 ? 'day' : 'days'} in {monthName(first)}</Printed>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Label key={i} size={12} align="center" style={{ flex: 1 }}>{d}</Label>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
          {cells.map((d, i) => {
            const dayKey = d ? `${key}-${pad(d)}` : '';
            const rec = d ? recordFor(data.history, dayKey) : undefined;
            const isToday = isCurrent && d === t.day;
            return (
              <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 3 }}>
                {d && (
                  <View
                    style={{
                      flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: rec ? color.accent : 'transparent',
                      borderWidth: isToday || rec ? size.lineWeightUi : 0, borderColor: color.ink,
                    }}
                  >
                    <Label size={12} colour={color.ink}>{d}</Label>
                    {rec && <Pen size={13} style={{ lineHeight: 15 }}>{rec.nogginScore}</Pen>}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </Paper>
  );
}
