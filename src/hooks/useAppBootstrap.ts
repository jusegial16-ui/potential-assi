import { useEffect } from 'react';
import { requestNotificationPermission } from '@/services/notificationService';
import { useAppStore } from '@/store/useAppStore';

export function useAppBootstrap() {
  const initialize = useAppStore((s) => s.initialize);
  const initialized = useAppStore((s) => s.initialized);

  useEffect(() => {
    initialize();
    requestNotificationPermission();
  }, [initialize]);

  return initialized;
}
