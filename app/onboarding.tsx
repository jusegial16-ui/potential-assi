import { Redirect, router } from 'expo-router';
import { Button, Text } from 'react-native';
import { AppContainer } from '@/components/AppContainer';
import { Card } from '@/components/Card';
import { useAppStore } from '@/store/useAppStore';

export default function OnboardingScreen() {
  const { settings, completeOnboarding } = useAppStore();
  if (settings.onboardingDone) return <Redirect href="/(tabs)" />;

  return (
    <AppContainer>
      <Card>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Bienvenido a Mi Día</Text>
        <Text>Tu diario inteligente local para tareas, metas y recordatorios.</Text>
        <Button
          title="Empezar"
          onPress={() => {
            completeOnboarding();
            router.replace('/(tabs)');
          }}
        />
      </Card>
    </AppContainer>
  );
}
