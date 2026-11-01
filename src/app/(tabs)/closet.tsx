import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../state/AppState';
import { GiftIcon } from '../../ui/icons';
import { Noggin } from '../../ui/Noggin';
import { Paper } from '../../ui/Paper';
import { Label, Pen, Printed } from '../../ui/text';

/** Outfits and gifts. Gifts are always earned, never sold. Placeholder for now. */
export default function Closet() {
  const insets = useSafeAreaInsets();
  const { data } = useApp();
  const gifts = data.happiness.gifts;
  return (
    <Paper>
      <View style={{ flex: 1, paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
        <Label size={13}>outfits and gifts</Label>
        <Printed weight="bold" size={28}>Closet</Printed>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Noggin width={200} expression="calm" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28 }}>
            <GiftIcon size={34} lit={gifts > 0} />
            <Pen size={34}>{gifts}</Pen>
          </View>
          <Printed weight="regular" size={15} align="center" style={{ marginTop: 10, maxWidth: 260 }}>
            Fill the happiness meter to earn gifts. Outfits are coming soon!
          </Printed>
        </View>
      </View>
    </Paper>
  );
}
