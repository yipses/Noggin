import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { KleeOne_400Regular, KleeOne_600SemiBold } from '@expo-google-fonts/klee-one';
import { MPLUSRounded1c_400Regular, MPLUSRounded1c_500Medium, MPLUSRounded1c_700Bold } from '@expo-google-fonts/m-plus-rounded-1c';
import { useFonts } from 'expo-font';
import { ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider, useApp } from '../state/AppState';
import { color } from '../ui/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Gate() {
  const { ready } = useApp();
  const [fontsLoaded, fontError] = useFonts({
    MPLUSRounded1c_400Regular, MPLUSRounded1c_500Medium, MPLUSRounded1c_700Bold,
    DMMono_400Regular, DMMono_500Medium,
    KleeOne_400Regular, KleeOne_600SemiBold,
  });
  // Never wait on fonts forever: after a few seconds, go on with system fonts.
  const [fontTimeout, setFontTimeout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFontTimeout(true), FONT_WAIT_MS);
    return () => clearTimeout(t);
  }, []);
  const go = ready && (fontsLoaded || !!fontError || fontTimeout);
  useEffect(() => {
    if (go) SplashScreen.hideAsync().catch(() => {});
  }, [go]);
  if (!go) return <Loading ready={ready} fonts={fontsLoaded || !!fontError} />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.paper }, animation: 'fade' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
      <Stack.Screen name="test" options={{ gestureEnabled: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="results" options={{ gestureEnabled: false }} />
      <Stack.Screen name="practice/[drill]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="calendar" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

const FONT_WAIT_MS = 4000;

/** Plain paper while starting up (never a blank white screen). */
function Loading({ ready, fonts }: { ready: boolean; fonts: boolean }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: color.paper, alignItems: 'center', justifyContent: 'center' }}>
      {slow && (
        <Text style={{ color: color.inkMuted, fontSize: 13 }}>
          loading ({ready ? 'saved data ok' : 'reading saved data'}, {fonts ? 'fonts ok' : 'loading fonts'})
        </Text>
      )}
    </View>
  );
}

/** If anything crashes, say so on screen instead of showing a blank page. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: color.paper, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: color.ink, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Something went wrong</Text>
      <Text selectable style={{ color: color.inkMuted, fontSize: 13, marginBottom: 20 }}>{String(error?.message ?? error)}</Text>
      <Pressable onPress={retry} style={{ backgroundColor: color.ink, borderRadius: 28, height: 56, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>Try again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Gate />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
