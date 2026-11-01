import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../state/AppState';
import { TabIcon, TabIconName } from '../../ui/icons';
import { color, font, size } from '../../ui/theme';

const TABS: { name: string; title: string; icon: TabIconName }[] = [
  { name: 'index', title: 'Today', icon: 'today' },
  { name: 'drills', title: 'Drills', icon: 'drills' },
  { name: 'closet', title: 'Closet', icon: 'closet' },
  { name: 'me', title: 'Me', icon: 'me' },
];

export default function TabsLayout() {
  const { data } = useApp();
  const insets = useSafeAreaInsets();
  if (!data.profile) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: color.paper },
        tabBarActiveTintColor: color.ink,
        tabBarInactiveTintColor: color.inkMuted,
        tabBarStyle: {
          backgroundColor: color.paper, borderTopColor: color.rule, borderTopWidth: size.lineWeightUi,
          height: 66 + insets.bottom, paddingTop: 4, paddingBottom: insets.bottom + 4,
        },
        tabBarLabelStyle: { fontFamily: font.label, fontSize: 11, lineHeight: 15 },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{ title: t.title, tabBarIcon: ({ color: c }) => <TabIcon name={t.icon} colour={String(c)} /> }}
        />
      ))}
    </Tabs>
  );
}
