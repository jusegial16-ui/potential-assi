import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const onboardingDone = useAppStore((s) => s.settings.onboardingDone);
  return <Redirect href={onboardingDone ? '/(tabs)' : '/onboarding'} />;
}
