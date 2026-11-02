import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../state/AppState';
import { Button } from '../../ui/Button';
import { GridRule } from '../../ui/GridRule';
import { Paper } from '../../ui/Paper';
import { Label, Pen, Printed } from '../../ui/text';

export default function Me() {
  const insets = useSafeAreaInsets();
  const { data, resetAll, seedSampleWeek } = useApp();
  const p = data.profile;
  return (
    <Paper>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 40 }}>
        <Label size={13}>you and your noggin</Label>
        <Printed weight="bold" size={28} style={{ marginBottom: 20 }}>Me</Printed>

        <Label size={12}>your name</Label>
        <Pen size={30}>{p?.playerName}</Pen>
        <GridRule width={200} style={{ marginBottom: 16 }} />

        <Label size={12}>birth year</Label>
        <Pen size={30}>{p?.birthYear}</Pen>
        <GridRule width={200} style={{ marginBottom: 16 }} />

        <Label size={12}>days trained</Label>
        <Pen size={30}>{data.history.length}</Pen>
        <GridRule width={200} style={{ marginBottom: 28 }} />

        {__DEV__ && (
          <View style={{ gap: 12 }}>
            <Label size={12}>prototype tools</Label>
            <Button variant="secondary" title="Fill a sample week" onPress={seedSampleWeek} />
            <Button variant="secondary" title="Start over" onPress={resetAll} />
          </View>
        )}
      </ScrollView>
    </Paper>
  );
}
