import { AppSettings, Goal, JournalEntry, Reminder, Task } from '@/types';

export interface PersistenceAdapter {
  init(): Promise<void>;
  seedIfEmpty(): Promise<void>;
  getJournalEntries(): Promise<JournalEntry[]>;
  saveJournalEntry(entry: JournalEntry): Promise<void>;
  getTasks(): Promise<Task[]>;
  saveTask(task: Task): Promise<void>;
  getReminders(): Promise<Reminder[]>;
  saveReminder(reminder: Reminder): Promise<void>;
  getGoals(): Promise<Goal[]>;
  saveGoal(goal: Goal): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
}
