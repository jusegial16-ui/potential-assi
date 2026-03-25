import { Platform } from 'react-native';
import { Reminder } from '@/types';

let notificationsModule: typeof import('expo-notifications') | null = null;

async function getNotifications() {
  if (Platform.OS === 'web') return null;
  if (notificationsModule) return notificationsModule;
  notificationsModule = await import('expo-notifications');
  notificationsModule.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false
    })
  });
  return notificationsModule;
}

export async function requestNotificationPermission() {
  const Notifications = await getNotifications();
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminderNotification(reminder: Reminder) {
  const Notifications = await getNotifications();
  if (!Notifications) return undefined;

  const triggerDate = new Date(reminder.remindAt);
  if (triggerDate < new Date()) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.title,
      body: reminder.description || 'Recordatorio de Mi Día'
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate
    }
  });
}

export async function cancelReminderNotification(notificationId?: string) {
  const Notifications = await getNotifications();
  if (!Notifications || !notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
