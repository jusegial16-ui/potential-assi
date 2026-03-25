import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAppBootstrap } from '@/hooks/useAppBootstrap';

export default function RootLayout() {
  const initialized = useAppBootstrap();

  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="lock" options={{ presentation: 'modal', title: 'Desbloqueo' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="entry/new" options={{ title: 'Contar mi día' }} />
      <Stack.Screen name="entry/[id]" options={{ title: 'Detalle de entrada' }} />
      <Stack.Screen name="search" options={{ title: 'Buscar' }} />
    </Stack>
  );
}
