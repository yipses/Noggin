import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { KleeOne_400Regular, KleeOne_600SemiBold } from '@expo-google-fonts/klee-one';
import { MPLUSRounded1c_400Regular, MPLUSRounded1c_500Medium, MPLUSRounded1c_700Bold } from '@expo-google-fonts/m-plus-rounded-1c';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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
  const go = ready && (fontsLoaded || !!fontError);
  useEffect(() => {
    if (go) SplashScreen.hideAsync().catch(() => {});
  }, [go]);
  if (!go) return null;
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
