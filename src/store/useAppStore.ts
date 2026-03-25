import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from '@/db';
import { cancelReminderNotification, scheduleReminderNotification } from '@/services/notificationService';
import { storageService } from '@/services/storageService';
import { Goal, JournalEntry, Reminder, Task, AppSettings, ParsedEntry } from '@/types';

interface AppState {
  initialized: boolean;
  entries: JournalEntry[];
  tasks: Task[];
  reminders: Reminder[];
  goals: Goal[];
  settings: AppSettings;
  initialize: () => Promise<void>;
  completeOnboarding: () => void;
  setPin: (pin?: string) => void;
  addJournalWithParsed: (rawText: string, parsed: ParsedEntry) => Promise<string>;
  toggleTask: (id: string) => void;
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  addReminder: (input: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'notificationId'>) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  addGoal: (input: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'currentValue' | 'status'>) => void;
  updateGoalProgress: (id: string, value: number) => void;
}

const nowIso = () => new Date().toISOString();

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  entries: [],
  tasks: [],
  reminders: [],
  goals: [],
  settings: { onboardingDone: false, pinEnabled: false },

  initialize: async () => {
    initDb();
    storageService.seedIfEmpty();
    set({
      entries: storageService.getJournalEntries(),
      tasks: storageService.getTasks(),
      reminders: storageService.getReminders(),
      goals: storageService.getGoals(),
      settings: storageService.getSettings(),
      initialized: true
    });
  },

  completeOnboarding: () => {
    const settings = { ...get().settings, onboardingDone: true };
    storageService.saveSettings(settings);
    set({ settings });
  },

  setPin: (pin) => {
    const settings = { ...get().settings, pinEnabled: !!pin, pinCode: pin };
    storageService.saveSettings(settings);
    set({ settings });
  },

  addJournalWithParsed: async (rawText, parsed) => {
    const id = uuidv4();
    const timestamp = nowIso();
    const entry: JournalEntry = {
      id,
      rawText,
      summary: parsed.summary,
      tags: parsed.tags,
      date: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    storageService.saveJournalEntry(entry);

    parsed.tasks.forEach((task) => {
      get().addTask({ ...task, relatedEntryId: id });
    });

    for (const reminder of parsed.reminders) {
      await get().addReminder({ ...reminder, relatedEntryId: id });
    }

    parsed.goals.forEach((goal) => {
      get().addGoal(goal);
    });

    set({ entries: [entry, ...get().entries] });
    return id;
  },

  toggleTask: (id) => {
    const tasks = get().tasks.map((task) => {
      if (task.id !== id) return task;
      const updated = { ...task, completed: !task.completed, updatedAt: nowIso() };
      storageService.saveTask(updated);
      return updated;
    });
    set({ tasks });
  },

  addTask: (input) => {
    const task: Task = { id: uuidv4(), ...input, completed: false, createdAt: nowIso(), updatedAt: nowIso() };
    storageService.saveTask(task);
    set({ tasks: [task, ...get().tasks] });
  },

  addReminder: async (input) => {
    const reminder: Reminder = { id: uuidv4(), ...input, completed: false, createdAt: nowIso(), updatedAt: nowIso() };
    const notificationId = await scheduleReminderNotification(reminder);
    reminder.notificationId = notificationId;
    storageService.saveReminder(reminder);
    set({ reminders: [reminder, ...get().reminders] });
  },

  toggleReminder: async (id) => {
    const reminders = [...get().reminders];
    const index = reminders.findIndex((r) => r.id === id);
    if (index < 0) return;
    const reminder = reminders[index];
    const updated = { ...reminder, completed: !reminder.completed, updatedAt: nowIso() };
    if (updated.completed) await cancelReminderNotification(updated.notificationId);
    storageService.saveReminder(updated);
    reminders[index] = updated;
    set({ reminders });
  },

  addGoal: (input) => {
    const goal: Goal = { id: uuidv4(), ...input, currentValue: 0, status: 'active', createdAt: nowIso(), updatedAt: nowIso() };
    storageService.saveGoal(goal);
    set({ goals: [goal, ...get().goals] });
  },

  updateGoalProgress: (id, value) => {
    const goals = get().goals.map((goal) => {
      if (goal.id !== id) return goal;
      const status = goal.targetValue && value >= goal.targetValue ? 'completed' : goal.status;
      const updated = { ...goal, currentValue: value, status, updatedAt: nowIso() };
      storageService.saveGoal(updated);
      return updated;
    });
    set({ goals });
  }
}));
