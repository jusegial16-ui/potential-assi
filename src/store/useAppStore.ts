import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { cancelReminderNotification, scheduleReminderNotification } from '@/services/notificationService';
import { Goal, JournalEntry, Reminder, Task, AppSettings, ParsedEntry } from '@/types';
import { repository } from '@/repositories';

interface AppState {
  initialized: boolean;
  entries: JournalEntry[];
  tasks: Task[];
  reminders: Reminder[];
  goals: Goal[];
  settings: AppSettings;
  initialize: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setPin: (pin?: string) => Promise<void>;
  addJournalWithParsed: (rawText: string, parsed: ParsedEntry) => Promise<string>;
  toggleTask: (id: string) => Promise<void>;
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => Promise<void>;
  addReminder: (input: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'notificationId'>) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  addGoal: (input: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'currentValue' | 'status'>) => Promise<void>;
  updateGoalProgress: (id: string, value: number) => Promise<void>;
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
    await repository.init();
    await repository.seedIfEmpty();
    const [entries, tasks, reminders, goals, settings] = await Promise.all([
      repository.getJournalEntries(),
      repository.getTasks(),
      repository.getReminders(),
      repository.getGoals(),
      repository.getSettings()
    ]);
    set({ entries, tasks, reminders, goals, settings, initialized: true });
  },

  completeOnboarding: async () => {
    const settings = { ...get().settings, onboardingDone: true };
    await repository.saveSettings(settings);
    set({ settings });
  },

  setPin: async (pin) => {
    const settings = { ...get().settings, pinEnabled: !!pin, pinCode: pin };
    await repository.saveSettings(settings);
    set({ settings });
  },

  addJournalWithParsed: async (rawText, parsed) => {
    const id = uuidv4();
    const timestamp = nowIso();
    const entry: JournalEntry = { id, rawText, summary: parsed.summary, tags: parsed.tags, date: timestamp, createdAt: timestamp, updatedAt: timestamp };
    await repository.saveJournalEntry(entry);

    for (const task of parsed.tasks) await get().addTask({ ...task, relatedEntryId: id });
    for (const reminder of parsed.reminders) await get().addReminder({ ...reminder, relatedEntryId: id });
    for (const goal of parsed.goals) await get().addGoal(goal);

    set({ entries: [entry, ...get().entries] });
    return id;
  },

  toggleTask: async (id) => {
    const tasks = [...get().tasks];
    const index = tasks.findIndex((task) => task.id === id);
    if (index < 0) return;
    const updated = { ...tasks[index], completed: !tasks[index].completed, updatedAt: nowIso() };
    await repository.saveTask(updated);
    tasks[index] = updated;
    set({ tasks });
  },

  addTask: async (input) => {
    const task: Task = { id: uuidv4(), ...input, completed: false, createdAt: nowIso(), updatedAt: nowIso() };
    await repository.saveTask(task);
    set({ tasks: [task, ...get().tasks] });
  },

  addReminder: async (input) => {
    const reminder: Reminder = { id: uuidv4(), ...input, completed: false, createdAt: nowIso(), updatedAt: nowIso() };
    const notificationId = await scheduleReminderNotification(reminder);
    reminder.notificationId = notificationId;
    await repository.saveReminder(reminder);
    set({ reminders: [reminder, ...get().reminders] });
  },

  toggleReminder: async (id) => {
    const reminders = [...get().reminders];
    const index = reminders.findIndex((r) => r.id === id);
    if (index < 0) return;
    const updated = { ...reminders[index], completed: !reminders[index].completed, updatedAt: nowIso() };
    if (updated.completed) await cancelReminderNotification(updated.notificationId);
    await repository.saveReminder(updated);
    reminders[index] = updated;
    set({ reminders });
  },

  addGoal: async (input) => {
    const goal: Goal = { id: uuidv4(), ...input, currentValue: 0, status: 'active', createdAt: nowIso(), updatedAt: nowIso() };
    await repository.saveGoal(goal);
    set({ goals: [goal, ...get().goals] });
  },

  updateGoalProgress: async (id, value) => {
    const goals = [...get().goals];
    const index = goals.findIndex((g) => g.id === id);
    if (index < 0) return;
    const goal = goals[index];
    const status = goal.targetValue && value >= goal.targetValue ? 'completed' : goal.status;
    const updated = { ...goal, currentValue: value, status, updatedAt: nowIso() };
    await repository.saveGoal(updated);
    goals[index] = updated;
    set({ goals });
  }
}));
