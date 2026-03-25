import * as Notifications from 'expo-notifications';
import { Reminder } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false
  })
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminderNotification(reminder: Reminder) {
  const triggerDate = new Date(reminder.remindAt);
  if (triggerDate < new Date()) return undefined;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.title,
      body: reminder.description || 'Recordatorio de Mi Día'
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate
    }
  });

  return id;
}

export async function cancelReminderNotification(notificationId?: string) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
